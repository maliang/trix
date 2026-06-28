import { computed, ref } from 'vue';
import { get } from '@/service/request';
import { useNotificationStore } from '@/store/modules/notification';
import { useAudioUnlock } from '@/service/audio/unlock';
import type { NotificationMessage, PollResponseData } from '@/components/common/header-notification/types';

export type NotificationRealtimeDriver = 'polling' | 'ws';

export interface NotificationBehaviorAction {
  /** 动作类型，如 sound / notification / 自定义动作名 */
  type: string;
  [key: string]: unknown;
}

export interface NotificationBehaviorConfig {
  /** 是否在新消息到达时触发，默认 true */
  playOnNew?: boolean;
  /** 该类型新消息到达时是否弹出应用内通知 toast，默认 true */
  notify?: boolean;
  /** 行为动作列表 */
  actions?: NotificationBehaviorAction[];
}

export interface NotificationRealtimeConfig {
  enabled?: boolean;
  driver?: NotificationRealtimeDriver;
  polling?: {
    api?: string;
    interval?: number;
  };
  websocket?: {
    url?: string;
  };
  notificationDuration?: number;
  enableNotification?: boolean;
  /** 按消息 type 配置行为 */
  behaviors?: Record<string, NotificationBehaviorConfig>;
}

type PollFetcher = (api: string, params: Record<string, unknown>) => Promise<PollResponseData | null>;
type BehaviorAudioPlayer = (src: string) => Promise<void> | void;
type BehaviorActionHandler = (action: NotificationBehaviorAction, message: NotificationMessage) => Promise<void> | void;

const MIN_POLLING_INTERVAL = 1000;
const DEFAULT_REALTIME_CONFIG: NotificationRealtimeConfig = {
  enabled: true,
  driver: 'polling',
  polling: {
    api: '/notifications/poll',
    interval: 15000
  },
  websocket: {
    url: ''
  },
  behaviors: {}
};

function normalizeInterval(interval?: number): number {
  return Math.max(Number(interval) || 15000, MIN_POLLING_INTERVAL);
}

function resolveRealtimeConfig(nextConfig?: NotificationRealtimeConfig): NotificationRealtimeConfig {
  return {
    ...DEFAULT_REALTIME_CONFIG,
    ...nextConfig,
    polling: {
      ...DEFAULT_REALTIME_CONFIG.polling,
      ...nextConfig?.polling
    },
    websocket: {
      ...DEFAULT_REALTIME_CONFIG.websocket,
      ...nextConfig?.websocket
    },
    behaviors: nextConfig?.behaviors ?? DEFAULT_REALTIME_CONFIG.behaviors
  };
}

function showInAppNotification(message: NotificationMessage, config: NotificationRealtimeConfig): void {
  if (config.enableNotification === false) return;

  window.$notification?.create({
    title: message.title,
    content: message.content,
    duration: config.notificationDuration ?? 4500,
    closable: true
  });
}

function getMessageExtraActions(message: NotificationMessage): NotificationBehaviorAction[] | undefined {
  const actions = message.extra?.actions;
  if (!Array.isArray(actions)) return undefined;

  return actions.filter((action): action is NotificationBehaviorAction => {
    return Boolean(action && typeof action === 'object' && typeof action.type === 'string' && action.type);
  });
}

function normalizePlayTimes(value?: number): number {
  return Math.min(Math.max(Math.floor(Number(value) || 1), 1), 10);
}

function getActionString(action: NotificationBehaviorAction, key: string): string | undefined {
  const value = action[key];
  return typeof value === 'string' && value ? value : undefined;
}

function getActionNumber(action: NotificationBehaviorAction, key: string): number | undefined {
  const value = action[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

async function defaultAudioPlayer(src: string): Promise<void> {
  await useAudioUnlock().play(src);
}

function createNotificationRealtime() {
  const config = ref<NotificationRealtimeConfig>(resolveRealtimeConfig());
  const isPolling = ref(false);
  const isWsConnected = ref(false);
  const isRunning = computed(() => isPolling.value || isWsConnected.value);

  let pollingTimer: ReturnType<typeof setInterval> | null = null;
  let maxMessageId = 0;
  let ws: WebSocket | null = null;
  const handledBehaviorMessageIds = new Set<string>();
  let pollFetcher: PollFetcher = async (api, params) => {
    const { data, error } = await get<PollResponseData>(api, params, { showErrorMessage: false });
    if (error) {
      console.error('[NotificationRealtime] poll failed:', error);
      return null;
    }
    return data;
  };
  let behaviorAudioPlayer: BehaviorAudioPlayer = defaultAudioPlayer;
  const behaviorActionHandlers = new Map<string, BehaviorActionHandler>();

  function configure(nextConfig?: NotificationRealtimeConfig): void {
    config.value = resolveRealtimeConfig(nextConfig);
  }

  function setPollFetcher(fetcher: PollFetcher): void {
    pollFetcher = fetcher;
  }

  function setBehaviorAudioPlayer(player: BehaviorAudioPlayer): void {
    behaviorAudioPlayer = player;
  }

  function registerBehaviorAction(type: string, handler: BehaviorActionHandler): void {
    behaviorActionHandlers.set(type, handler);
  }

  async function runSoundAction(action: NotificationBehaviorAction): Promise<void> {
    const src = getActionString(action, 'src');
    if (!src) return;

    const times = normalizePlayTimes(getActionNumber(action, 'times'));
    for (let index = 0; index < times; index += 1) {
      await behaviorAudioPlayer(src);
    }
  }

  function runNotificationAction(action: NotificationBehaviorAction, message: NotificationMessage): void {
    window.$notification?.create({
      title: getActionString(action, 'title') || message.title,
      content: getActionString(action, 'content') || message.content,
      duration: getActionNumber(action, 'duration') ?? config.value.notificationDuration ?? 4500,
      closable: true
    });
  }

  async function runBehaviorAction(action: NotificationBehaviorAction, message: NotificationMessage): Promise<void> {
    if (action.type === 'sound') {
      await runSoundAction(action);
      return;
    }

    if (action.type === 'notification') {
      runNotificationAction(action, message);
      return;
    }

    const handler = behaviorActionHandlers.get(action.type);
    if (handler) {
      await handler(action, message);
    }
  }

  async function runMessageBehavior(message: NotificationMessage): Promise<void> {
    if (handledBehaviorMessageIds.has(message.id)) return;

    const behavior = config.value.behaviors?.[message.type];
    const playOnNew = behavior?.playOnNew !== false;
    const actions = getMessageExtraActions(message) || behavior?.actions || [];

    if (!actions.length || !playOnNew) return;

    handledBehaviorMessageIds.add(message.id);

    for (const action of actions) {
      try {
        await runBehaviorAction(action, message);
      } catch (error) {
        console.warn('[NotificationRealtime] behavior action failed:', action.type, error);
      }
    }
  }

  async function handleMessage(message: NotificationMessage, updateUnreadCounts = true): Promise<void> {
    const store = useNotificationStore();
    store.addMessage(message);

    if (updateUnreadCounts && !message.isRead) {
      store.increaseUnreadCounts([message.type]);
    }

    const id = Number(message.id);
    if (Number.isFinite(id) && id > maxMessageId) {
      maxMessageId = id;
    }

    // 按类型控制是否弹出应用内通知 toast（behaviors[type].notify === false 时不弹）
    const behavior = config.value.behaviors?.[message.type];
    if (behavior?.notify !== false) {
      showInAppNotification(message, config.value);
    }
    await runMessageBehavior(message);
  }

  async function handlePollResult(response: PollResponseData | null): Promise<void> {
    if (response) {
      useNotificationStore().setUnreadCounts(response.unread_count, response.unread_count_by_type || {});
    }

    if (!response?.has_new || !response.messages?.length) return;
    for (const message of response.messages) {
      await handleMessage(message, false);
    }
  }

  async function pollOnce(): Promise<void> {
    const api = config.value.polling?.api;
    if (!api) {
      console.warn('[NotificationRealtime] polling api is not configured');
      stopPolling();
      return;
    }

    const response = await pollFetcher(api, { since_id: maxMessageId });
    await handlePollResult(response);
  }

  async function refresh(): Promise<void> {
    await pollOnce();
  }

  function startPolling(): void {
    if (pollingTimer || isPolling.value) return;

    isPolling.value = true;
    void pollOnce();
    pollingTimer = setInterval(() => {
      pollOnce();
    }, normalizeInterval(config.value.polling?.interval));
  }

  function stopPolling(): void {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    isPolling.value = false;
  }

  function startWs(): void {
    const url = config.value.websocket?.url;
    if (!url || ws) return;

    ws = new WebSocket(url);
    ws.onopen = () => {
      isWsConnected.value = true;
    };
    ws.onmessage = event => {
      try {
        const payload = JSON.parse(event.data);
        if (payload?.type === 'notification' && payload.data) {
          void handleMessage(payload.data);
        }
      } catch (error) {
        console.error('[NotificationRealtime] websocket message parse failed:', error);
      }
    };
    ws.onclose = () => {
      isWsConnected.value = false;
      ws = null;
    };
    ws.onerror = error => {
      console.error('[NotificationRealtime] websocket error:', error);
    };
  }

  function stopWs(): void {
    if (ws) {
      ws.close();
      ws = null;
    }
    isWsConnected.value = false;
  }

  function start(nextConfig?: NotificationRealtimeConfig): void {
    configure(nextConfig ?? config.value);
    if (config.value.enabled === false) return;

    if (config.value.driver === 'ws') {
      if (!config.value.websocket?.url) return;
      startWs();
      return;
    }

    if (!config.value.polling?.api) return;
    startPolling();
  }

  function stop(): void {
    stopPolling();
    stopWs();
    maxMessageId = 0;
    handledBehaviorMessageIds.clear();
  }

  return {
    config,
    isPolling,
    isWsConnected,
    isRunning,
    configure,
    setPollFetcher,
    setBehaviorAudioPlayer,
    registerBehaviorAction,
    pollOnce,
    refresh,
    start,
    stop
  };
}

const notificationRealtime = createNotificationRealtime();

export function useNotificationRealtime() {
  return notificationRealtime;
}
