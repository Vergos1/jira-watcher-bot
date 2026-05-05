export type JiraWebhookPayload = {
  webhookEvent: string;
  issue: {
    key: string;
    fields: {
      summary: string;
      assignee: { displayName: string };
    };
  };
  changelog: {
    items: { field: string; fromString: string; toString: string }[];
  };
};
