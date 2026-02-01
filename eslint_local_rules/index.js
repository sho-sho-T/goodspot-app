// eslint plugin: 各カスタムルールをエクスポートするインデックス
module.exports = {
  'use-server-check': require('./use_server_check'),
  'use-client-check': require('./use_client_check'),
  'restrict-service-imports': require('./restrict_service_imports'),
  'require-server-only': require('./require_server_only'),
  'restrict-action-imports': require('./restrict_action_imports'),
  'use-nextjs-helpers': require('./use_nextjs_helpers'),
  'no-external-domain-imports': require('./no_external_domain_imports'),
};
