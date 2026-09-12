export type ReplyClassification = { classification: "INTERESTED" | "PERMISSION_GRANTED" | "QUESTION" | "NOT_INTERESTED" | "UNSUBSCRIBE" | "OUT_OF_OFFICE" | "OTHER"; confidence: number; reasoningSummary: string; requiresHumanReview: boolean };
export function classifyReplyDeterministically(raw: string, threshold = 0.8): ReplyClassification {
  const text = raw.trim().toLowerCase(); let classification: ReplyClassification["classification"] = "OTHER"; let confidence = 0.55;
  if (/unsubscribe|remove me|stop email|do not contact/.test(text)) { classification = "UNSUBSCRIBE"; confidence = 0.99; }
  else if (/out of (the )?office|automatic reply/.test(text)) { classification = "OUT_OF_OFFICE"; confidence = 0.98; }
  else if (/sure[, ]+go ahead|i authorize|permission (is )?granted|yes.*permission/.test(text)) { classification = "PERMISSION_GRANTED"; confidence = 0.92; }
  else if (/not interested|no thanks/.test(text)) { classification = "NOT_INTERESTED"; confidence = 0.95; }
  else if (/\?|how much|what does/.test(text)) { classification = "QUESTION"; confidence = 0.86; }
  else if (/interested|tell me more|sounds good/.test(text)) { classification = "INTERESTED"; confidence = 0.84; }
  return { classification, confidence, reasoningSummary: `Rule-based MVP classification: ${classification}.`, requiresHumanReview: classification !== "UNSUBSCRIBE" && confidence < threshold };
}
