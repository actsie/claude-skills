import { hashFingerprint } from './fingerprint';
import { NotHelpfulReason } from './validation';

interface DiscordEmbed {
  title: string;
  color: number;
  fields: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp: string;
  footer?: {
    text: string;
  };
}

/**
 * Send feedback to Discord webhook
 */
export async function sendFeedbackToDiscord(data: {
  skillId: string;
  skillTitle: string;
  voteType: 'helpful' | 'not_helpful';
  reason?: NotHelpfulReason;
  note?: string;
  fingerprint: string;
  metrics: {
    helpful: number;
    not_helpful: number;
    views: number;
  };
}): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK;

  console.log('[Discord] Webhook URL present:', !!webhookUrl);
  console.log('[Discord] Feedback data:', {
    skillId: data.skillId,
    voteType: data.voteType,
    reason: data.reason,
    hasNote: !!data.note,
  });

  if (!webhookUrl) {
    console.warn('[Discord] No webhook URL configured');
    return false;
  }

  const embed = buildFeedbackEmbed(data);
  console.log('[Discord] Embed built:', JSON.stringify(embed, null, 2));

  try {
    console.log('[Discord] Sending to webhook...');
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] }),
    });

    console.log('[Discord] Response status:', response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error('[Discord] Response error:', text);
      throw new Error(`Discord webhook failed: ${response.status} - ${text}`);
    }

    console.log('[Discord] Success!');
    return true;
  } catch (error) {
    console.error('[Discord] Webhook error:', error);

    // Retry once after 1.5s
    try {
      console.log('[Discord] Retrying in 1.5s...');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const retryResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ embeds: [embed] }),
      });

      console.log('[Discord] Retry response status:', retryResponse.status);
      return retryResponse.ok;
    } catch (retryError) {
      console.error('[Discord] Retry failed:', retryError);
      return false;
    }
  }
}

/**
 * Send threshold alert to Discord (e.g., high downvote ratio)
 */
export async function sendThresholdAlert(data: {
  skillId: string;
  skillTitle: string;
  alertType: 'high_downvotes' | 'spam_reports';
  metrics: {
    helpful: number;
    not_helpful: number;
    views: number;
  };
}): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_FEEDBACK_WEBHOOK;

  if (!webhookUrl) {
    console.warn('[Discord] No webhook URL configured');
    return false;
  }

  const embed = buildThresholdEmbed(data);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return response.ok;
  } catch (error) {
    console.error('[Discord] Threshold alert error:', error);
    return false;
  }
}

/**
 * Build Discord embed for feedback
 */
function buildFeedbackEmbed(data: {
  skillId: string;
  skillTitle: string;
  voteType: 'helpful' | 'not_helpful';
  reason?: NotHelpfulReason;
  note?: string;
  fingerprint: string;
  metrics: {
    helpful: number;
    not_helpful: number;
    views: number;
  };
}): DiscordEmbed {
  const { skillId, skillTitle, voteType, reason, note, fingerprint, metrics } = data;

  const isNotHelpful = voteType === 'not_helpful';
  const title = `Feedback: ${isNotHelpful ? 'Not helpful' : 'Helpful'} — ${skillTitle}`;
  const color = isNotHelpful ? 0xffa500 : 0x57f287; // Amber or Green

  const fields: DiscordEmbed['fields'] = [];

  // Add reason (only for not_helpful)
  if (isNotHelpful && reason) {
    fields.push({
      name: 'Reason',
      value: reason,
      inline: true,
    });
  }

  // Add user (hashed fingerprint)
  fields.push({
    name: 'User',
    value: `\`${hashFingerprint(fingerprint)}\``,
    inline: true,
  });

  // Add note if provided
  if (note) {
    fields.push({
      name: 'Note',
      value: note.slice(0, 500), // Ensure max length
    });
  }

  // Add current metrics
  fields.push({
    name: 'Current Metrics',
    value: `👍 ${metrics.helpful} · 👎 ${metrics.not_helpful} · 👁️ ${metrics.views} views`,
  });

  // Add skill link
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.pawgrammer.com';
  fields.push({
    name: 'Skill',
    value: `${baseUrl}/skills/${skillId}`,
  });

  return {
    title,
    color,
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: process.env.VERCEL_ENV || 'local',
    },
  };
}

/**
 * Build Discord embed for threshold alerts
 */
function buildThresholdEmbed(data: {
  skillId: string;
  skillTitle: string;
  alertType: 'high_downvotes' | 'spam_reports';
  metrics: {
    helpful: number;
    not_helpful: number;
    views: number;
  };
}): DiscordEmbed {
  const { skillId, skillTitle, alertType, metrics } = data;

  const title =
    alertType === 'high_downvotes'
      ? `⚠️ High Downvote Ratio — ${skillTitle}`
      : `🚨 Multiple Spam Reports — ${skillTitle}`;

  const color = alertType === 'high_downvotes' ? 0xffa500 : 0xff0000; // Amber or Red

  const ratio = ((metrics.not_helpful / (metrics.helpful + metrics.not_helpful)) * 100).toFixed(
    1
  );

  const fields: DiscordEmbed['fields'] = [
    {
      name: 'Alert Type',
      value: alertType === 'high_downvotes' ? 'High Downvotes (>35%)' : 'Spam Reports (≥2)',
      inline: true,
    },
    {
      name: 'Downvote Ratio',
      value: `${ratio}%`,
      inline: true,
    },
    {
      name: 'Current Metrics',
      value: `👍 ${metrics.helpful} · 👎 ${metrics.not_helpful} · 👁️ ${metrics.views} views`,
    },
    {
      name: 'Skill',
      value: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://skills.pawgrammer.com'}/skills/${skillId}`,
    },
  ];

  return {
    title,
    color,
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: process.env.VERCEL_ENV || 'local',
    },
  };
}
