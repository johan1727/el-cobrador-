import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type PlanType = 'free' | 'pro' | 'family';
export type BillingCycle = 'monthly' | 'annual';

export interface Subscription {
  id: string;
  userId: string;
  planType: PlanType;
  billingCycle: BillingCycle;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

export interface FamilyGroup {
  id: string;
  adminId: string;
  name: string;
  planType: PlanType;
  maxMembers: number;
  members: FamilyMember[];
}

export interface FamilyMember {
  id: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [loading, setLoading] = useState(true);

  // Load subscription from Supabase
  const loadSubscription = useCallback(async () => {
    if (!userId || !supabase) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

      if (data) {
        setSubscription({
          id: data.id,
          userId: data.user_id,
          planType: data.plan_type,
          billingCycle: data.billing_cycle,
          status: data.status,
          currentPeriodStart: new Date(data.current_period_start),
          currentPeriodEnd: new Date(data.current_period_end)
        });
      } else {
        // No subscription = free plan
        setSubscription({
          id: 'free',
          userId: userId,
          planType: 'free',
          billingCycle: 'monthly',
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000) // 100 years
        });
      }
    } catch (err) {
      console.error('Error loading subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Load family group if applicable
  const loadFamilyGroup = useCallback(async () => {
    if (!userId || !supabase) return;

    try {
      // Check if user is admin
      const { data: adminData, error: adminError } = await supabase
        .from('family_groups')
        .select('*')
        .eq('admin_id', userId)
        .single();

      if (!adminError && adminData) {
        const { data: membersData } = await supabase
          .from('family_members')
          .select('*')
          .eq('group_id', adminData.id);

        setFamilyGroup({
          id: adminData.id,
          adminId: adminData.admin_id,
          name: adminData.name,
          planType: adminData.plan_type,
          maxMembers: adminData.max_members,
          members: membersData?.map(m => ({
            id: m.id,
            userId: m.user_id,
            role: m.role,
            joinedAt: new Date(m.joined_at)
          })) || []
        });
        return;
      }

      // Check if user is member
      const { data: memberData } = await supabase
        .from('family_members')
        .select('group_id')
        .eq('user_id', userId)
        .single();

      if (memberData) {
        const { data: groupData } = await supabase
          .from('family_groups')
          .select('*')
          .eq('id', memberData.group_id)
          .single();

        if (groupData) {
          const { data: membersData } = await supabase
            .from('family_members')
            .select('*')
            .eq('group_id', groupData.id);

          setFamilyGroup({
            id: groupData.id,
            adminId: groupData.admin_id,
            name: groupData.name,
            planType: groupData.plan_type,
            maxMembers: groupData.max_members,
            members: membersData?.map(m => ({
              id: m.id,
              userId: m.user_id,
              role: m.role,
              joinedAt: new Date(m.joined_at)
            })) || []
          });
        }
      }
    } catch (err) {
      console.error('Error loading family group:', err);
    }
  }, [userId]);

  // Upgrade subscription
  const upgradePlan = useCallback(async (planType: PlanType, billingCycle: BillingCycle) => {
    if (!userId || !supabase) return false;

    try {
      const periodEnd = new Date();
      if (billingCycle === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_type: planType,
          billing_cycle: billingCycle,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      await loadSubscription();
      return true;
    } catch (err) {
      console.error('Error upgrading plan:', err);
      return false;
    }
  }, [userId, loadSubscription]);

  // Create family group
  const createFamilyGroup = useCallback(async (name: string) => {
    if (!userId || !supabase) return false;

    try {
      const { data, error } = await supabase
        .from('family_groups')
        .insert({
          admin_id: userId,
          name: name,
          plan_type: 'family',
          max_members: 5,
          billing_cycle: subscription?.billingCycle || 'monthly',
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Add admin as first member
      await supabase.from('family_members').insert({
        group_id: data.id,
        user_id: userId,
        role: 'admin'
      });

      await loadFamilyGroup();
      return true;
    } catch (err) {
      console.error('Error creating family group:', err);
      return false;
    }
  }, [userId, subscription?.billingCycle, loadFamilyGroup]);

  // Invite family member
  const inviteFamilyMember = useCallback(async (email: string) => {
    if (!familyGroup || !supabase) return false;
    // TODO: Implement email invitation
    console.log('Invite sent to:', email);
    return true;
  }, [familyGroup]);

  // Create Stripe Checkout Session
  const createCheckoutSession = useCallback(async (priceId: string, userEmail?: string) => {
    if (!userId) {
      console.error('No userId provided for checkout');
      return null;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId, userEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      return url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      return null;
    }
  }, [userId]);

  // Derived state
  const isPro = subscription?.planType === 'pro' || subscription?.planType === 'family';
  const isFamily = subscription?.planType === 'family';
  const isAnnual = subscription?.billingCycle === 'annual';

  // Load on mount
  useEffect(() => {
    loadSubscription();
    loadFamilyGroup();
  }, [loadSubscription, loadFamilyGroup]);

  return {
    subscription,
    familyGroup,
    loading,
    isPro,
    isFamily,
    isAnnual,
    upgradePlan,
    createCheckoutSession,
    createFamilyGroup,
    inviteFamilyMember,
    refresh: () => {
      loadSubscription();
      loadFamilyGroup();
    }
  };
}
