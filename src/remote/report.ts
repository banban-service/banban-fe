import { apiFetch } from "@/lib/apiFetch";

export interface ReportRequest {
  targetType: string;
  targetId: number;
  reasonCode: string;
  reasonDetail?: string;
}

export const postReport = async ({
  targetType,
  targetId,
  reasonCode,
  reasonDetail,
}: ReportRequest) => {
  const body: Record<string, any> = {
    target_type: targetType,
    target_id: targetId,
    reason_code: reasonCode,
  };

  // ETC일 때만 reason_detail 포함
  if (reasonCode === "ETC" && reasonDetail) {
    body.reason_detail = reasonDetail.trim();
  }

  return apiFetch("/reports/", {
    method: "POST",
    body: JSON.stringify(body),
  });
};
