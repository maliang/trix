import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationRealtime } from '@/service/notification/realtime';
import { useNotificationStore } from '@/store/modules/notification';

describe('notification realtime service', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    const service = useNotificationRealtime();
    service.stop();
    service.configure();
  });

  it('polls independently from HeaderNotification and writes new messages into the store', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      messages: [
        {
          id: '12',
          title: 'New message',
          content: 'Realtime content',
          type: 'system',
          isRead: false,
          createdAt: '2026-06-27T00:00:00.000Z'
        }
      ],
      unread_count: 1,
      has_new: true,
      server_time: '2026-06-27T00:00:01.000Z'
    });

    const service = useNotificationRealtime();
    const store = useNotificationStore();

    service.configure({
      enabled: true,
      driver: 'polling',
      polling: {
        api: '/notifications/poll',
        interval: 1500
      }
    });
    service.setPollFetcher(fetcher);
    service.start();

    expect(fetcher).toHaveBeenCalledWith('/notifications/poll', { since_id: 0 });

    await vi.advanceTimersByTimeAsync(0);

    expect(store.messages).toHaveLength(1);
    expect(store.messages[0].id).toBe('12');
    expect(service.isRunning.value).toBe(true);

    await vi.advanceTimersByTimeAsync(1500);
    expect(fetcher).toHaveBeenCalledTimes(2);

    service.stop();
    await vi.advanceTimersByTimeAsync(1500);

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(service.isRunning.value).toBe(false);
  });

  it('uses the default Thinkrix polling config when no backend realtime config is injected', () => {
    const fetcher = vi.fn().mockResolvedValue({
      messages: [],
      unread_count: 0,
      has_new: false,
      server_time: '2026-06-28T00:00:01.000Z'
    });
    const service = useNotificationRealtime();

    service.setPollFetcher(fetcher);
    service.start();

    expect(service.config.value.polling?.api).toBe('/notifications/poll');
    expect(service.config.value.polling?.interval).toBe(15000);
    expect(fetcher).toHaveBeenCalledWith('/notifications/poll', { since_id: 0 });

    service.stop();
  });

  it('runs configured behavior actions once per new message and repeats sound action', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      messages: [
        {
          id: 'audit-1',
          title: 'Audit pending',
          content: 'Please review',
          type: 'audit.pending',
          isRead: false,
          createdAt: '2026-06-28T00:00:00.000Z'
        }
      ],
      unread_count: 1,
      has_new: true,
      server_time: '2026-06-28T00:00:01.000Z'
    });
    const playSound = vi.fn().mockResolvedValue(undefined);
    const service = useNotificationRealtime();

    service.configure({
      enabled: true,
      driver: 'polling',
      polling: {
        api: '/notifications/poll',
        interval: 1500
      },
      behaviors: {
        'audit.pending': {
          actions: [
            {
              type: 'sound',
              src: '/sounds/audit.mp3',
              times: 3
            }
          ]
        }
      }
    });
    service.setPollFetcher(fetcher);
    service.setBehaviorAudioPlayer(playSound);

    await service.pollOnce();
    await service.pollOnce();

    expect(playSound).toHaveBeenCalledTimes(3);
    expect(playSound).toHaveBeenNthCalledWith(1, '/sounds/audit.mp3');
    expect(playSound).toHaveBeenNthCalledWith(2, '/sounds/audit.mp3');
    expect(playSound).toHaveBeenNthCalledWith(3, '/sounds/audit.mp3');
  });

  it('lets each message override configured actions through extra.actions', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      messages: [
        {
          id: 'audit-2',
          title: 'Audit pending',
          content: 'Please review',
          type: 'audit.pending',
          isRead: false,
          createdAt: '2026-06-28T00:00:00.000Z',
          extra: {
            actions: [
              {
                type: 'sound',
                src: '/sounds/custom-audit.mp3',
                times: 2
              }
            ]
          }
        }
      ],
      unread_count: 1,
      has_new: true,
      server_time: '2026-06-28T00:00:01.000Z'
    });
    const playSound = vi.fn().mockResolvedValue(undefined);
    const service = useNotificationRealtime();

    service.configure({
      enabled: true,
      driver: 'polling',
      polling: {
        api: '/notifications/poll',
        interval: 1500
      },
      behaviors: {
        'audit.pending': {
          actions: [
            {
              type: 'sound',
              src: '/sounds/default-audit.mp3',
              times: 3
            }
          ]
        }
      }
    });
    service.setPollFetcher(fetcher);
    service.setBehaviorAudioPlayer(playSound);

    await service.pollOnce();

    expect(playSound).toHaveBeenCalledTimes(2);
    expect(playSound).toHaveBeenNthCalledWith(1, '/sounds/custom-audit.mp3');
    expect(playSound).toHaveBeenNthCalledWith(2, '/sounds/custom-audit.mp3');
  });

  it('allows custom behavior action handlers to be registered by action type', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      messages: [
        {
          id: 'audit-3',
          title: 'Audit pending',
          content: 'Please review',
          type: 'audit.pending',
          isRead: false,
          createdAt: '2026-06-28T00:00:00.000Z'
        }
      ],
      unread_count: 1,
      has_new: true,
      server_time: '2026-06-28T00:00:01.000Z'
    });
    const customHandler = vi.fn().mockResolvedValue(undefined);
    const service = useNotificationRealtime();

    service.configure({
      enabled: true,
      driver: 'polling',
      polling: {
        api: '/notifications/poll',
        interval: 1500
      },
      behaviors: {
        'audit.pending': {
          actions: [
            {
              type: 'custom-audit',
              payload: {
                level: 'urgent'
              }
            }
          ]
        }
      }
    });
    service.setPollFetcher(fetcher);
    service.registerBehaviorAction('custom-audit', customHandler);

    await service.pollOnce();

    expect(customHandler).toHaveBeenCalledTimes(1);
    expect(customHandler.mock.calls[0][0]).toEqual({
      type: 'custom-audit',
      payload: {
        level: 'urgent'
      }
    });
    expect(customHandler.mock.calls[0][1].id).toBe('audit-3');
  });
});
