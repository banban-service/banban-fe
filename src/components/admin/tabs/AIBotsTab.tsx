"use client";

import { useState } from "react";
import styled from "styled-components";
import {
  AdminCard,
  AdminCardTitle,
  Actions,
  SmallButton,
} from "@/components/admin/AdminUI";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminAIBots,
  deleteAdminAIBot,
  toggleAdminAIBotActivation,
  testAdminAIBotFeed,
  testAdminAIBotComment,
  getAdminAIBotActivityLog,
} from "@/remote/admin";
import type { AdminAIBot, AdminAIBotsData } from "@/types/admin";
import { useToast } from "@/components/common/Toast/useToast";
import { Modal } from "@/components/common/Modal/Modal";
import AIBotModal from "@/components/admin/modals/AIBotModal";
import AIBotActivityLogModal from "@/components/admin/modals/AIBotActivityLogModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const tableHeaderClass =
  "px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const tableCellClass = "px-4 py-2 text-sm text-slate-700";

const DEFAULT_LIMIT = 20;

export const AIBotsTab = () => {
  const { showToast } = useToast();
  const qc = useQueryClient();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<AdminAIBot | null>(null);
  const [activityLogBot, setActivityLogBot] = useState<AdminAIBot | null>(null);
  const [selectedBots, setSelectedBots] = useState<Set<number>>(new Set());

  const { data, isLoading, error } = useQuery<AdminAIBotsData>({
    queryKey: ["admin", "ai-bots", { page, limit }],
    queryFn: () =>
      getAdminAIBots({
        limit,
        offset: page * limit,
      }),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (botIds: number[]) => {
      await Promise.all(botIds.map((id) => deleteAdminAIBot(id)));
    },
    onSuccess: () => {
      showToast({ type: "success", message: "선택한 봇이 삭제되었습니다." });
      qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
      setSelectedBots(new Set());
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "일괄 삭제 실패";
      showToast({ type: "error", message });
    },
  });

  const bulkToggleMutation = useMutation({
    mutationFn: async ({ botIds, isActive }: { botIds: number[]; isActive: boolean }) => {
      await Promise.all(botIds.map((id) => toggleAdminAIBotActivation(id, isActive)));
    },
    onSuccess: () => {
      showToast({ type: "success", message: "선택한 봇의 상태가 변경되었습니다." });
      qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
      setSelectedBots(new Set());
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "일괄 상태 변경 실패";
      showToast({ type: "error", message });
    },
  });

  const testFeedMutation = useMutation({
    mutationFn: (botId: number) => testAdminAIBotFeed(botId),
    onSuccess: (data) => {
      showToast({
        type: "success",
        message: data.message || "피드 생성 테스트가 완료되었습니다.",
      });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "테스트 실패";
      showToast({ type: "error", message });
    },
  });

  const testCommentMutation = useMutation({
    mutationFn: (botId: number) => testAdminAIBotComment(botId),
    onSuccess: (data) => {
      showToast({
        type: "success",
        message: data.message || "댓글 생성 테스트가 완료되었습니다.",
      });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "테스트 실패";
      showToast({ type: "error", message });
    },
  });

  const total = data?.total ?? 0;
  const hasNext = (page + 1) * limit < total;
  const hasPrev = page > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR");
  };

  const bots = data?.bots ?? [];

  const toggleSelectAll = () => {
    if (selectedBots.size === bots.length) {
      setSelectedBots(new Set());
    } else {
      setSelectedBots(new Set(bots.map((bot) => bot.id)));
    }
  };

  const toggleSelectBot = (botId: number) => {
    const newSelected = new Set(selectedBots);
    if (newSelected.has(botId)) {
      newSelected.delete(botId);
    } else {
      newSelected.add(botId);
    }
    setSelectedBots(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedBots.size === 0) return;
    bulkDeleteMutation.mutate(Array.from(selectedBots));
  };

  const handleBulkToggle = () => {
    if (selectedBots.size === 0) return;
    const selectedBotsList = bots.filter(b => selectedBots.has(b.id));
    const allActive = selectedBotsList.every(b => b.isActive);
    bulkToggleMutation.mutate({ botIds: Array.from(selectedBots), isActive: !allActive });
  };

  return (
    <Container>
      <AdminCard>
        <AdminCardTitle>AI 봇 목록</AdminCardTitle>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            총 {total}개 (페이지 {page + 1})
            {selectedBots.size > 0 && ` · ${selectedBots.size}개 선택됨`}
          </div>
          <div className="flex items-center gap-2">
            {selectedBots.size === 1 && (() => {
              const selectedId = Array.from(selectedBots)[0];
              const selectedBot = bots.find(b => b.id === selectedId);
              return selectedBot ? (
                <>
                  <SmallButton onClick={() => setEditingBot(selectedBot)}>
                    수정
                  </SmallButton>
                  <SmallButton onClick={() => setActivityLogBot(selectedBot)}>
                    로그
                  </SmallButton>
                  <SmallButton
                    onClick={() => testFeedMutation.mutate(selectedBot.id)}
                    disabled={testFeedMutation.isPending}
                  >
                    피드 테스트
                  </SmallButton>
                  <SmallButton
                    onClick={() => testCommentMutation.mutate(selectedBot.id)}
                    disabled={testCommentMutation.isPending}
                  >
                    댓글 테스트
                  </SmallButton>
                </>
              ) : null;
            })()}
            {selectedBots.size > 0 && (
              <>
                <SmallButton
                  onClick={handleBulkToggle}
                  disabled={bulkToggleMutation.isPending}
                  style={{ color: "#0ea5e9" }}
                >
                  활성 상태 변경
                </SmallButton>
                <SmallButton
                  onClick={handleBulkDelete}
                  disabled={bulkDeleteMutation.isPending}
                  style={{ color: "#dc2626" }}
                >
                  선택 삭제
                </SmallButton>
              </>
            )}
            {selectedBots.size === 0 && (
              <SmallButton onClick={() => setCreateModalOpen(true)}>
                새 봇 생성
              </SmallButton>
            )}
          </div>
        </div>

        {isLoading && <p className="text-sm text-slate-500">로딩 중...</p>}
        {error && (
          <p className="text-sm text-red-600">{(error as Error).message}</p>
        )}
        {!isLoading && !error && bots.length === 0 && (
          <p className="text-sm text-slate-500">AI 봇이 없습니다.</p>
        )}
        {!isLoading && !error && bots.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className={`${tableHeaderClass} w-12`}>
                    <input
                      type="checkbox"
                      checked={bots.length > 0 && selectedBots.size === bots.length}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </th>
                  <th className={`${tableHeaderClass} w-20`}>ID</th>
                  <th className={tableHeaderClass}>이름</th>
                  <th className={tableHeaderClass}>Username</th>
                  <th className={tableHeaderClass}>상태</th>
                  <th className={`${tableHeaderClass} w-48`}>생성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white/95">
                {bots.map((bot) => (
                  <tr key={bot.id} className="hover:bg-slate-50/70">
                    <td className={tableCellClass}>
                      <input
                        type="checkbox"
                        checked={selectedBots.has(bot.id)}
                        onChange={() => toggleSelectBot(bot.id)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </td>
                    <td className={tableCellClass}>{bot.id}</td>
                    <td className={tableCellClass} title={bot.name}>
                      <div className="max-w-xs truncate">{bot.name}</div>
                    </td>
                    <td className={tableCellClass}>{bot.username}</td>
                    <td className={tableCellClass}>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        bot.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-slate-100 text-slate-800"
                      }`}>
                        {bot.isActive ? "활성" : "비활성"}
                      </span>
                    </td>
                    <td className={tableCellClass}>
                      {formatDate(bot.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && bots.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor="limit" className="text-sm text-slate-600">
                페이지 크기:
              </label>
              <select
                id="limit"
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                value={limit}
                onChange={(e) => {
                  setPage(0);
                  setLimit(Number(e.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
              >
                이전
              </button>
              <span className="text-sm text-slate-600">
                {page + 1} / {Math.ceil(total / limit) || 1}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Create/Edit Modal */}
      {createModalOpen && (
        <AIBotModal
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            setCreateModalOpen(false);
            qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
          }}
        />
      )}

      {editingBot && (
        <AIBotModal
          bot={editingBot}
          onClose={() => setEditingBot(null)}
          onSuccess={() => {
            setEditingBot(null);
            qc.invalidateQueries({ queryKey: ["admin", "ai-bots"] });
          }}
        />
      )}

      {/* Activity Log Modal */}
      {activityLogBot && (
        <AIBotActivityLogModal
          bot={activityLogBot}
          onClose={() => setActivityLogBot(null)}
        />
      )}
    </Container>
  );
};

export default AIBotsTab;
