module.exports = {
  rules: {
    'no-postgres-client-in-frontend': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Mencegah penggunaan postgresClient di lingkungan frontend',
          category: 'Possible Errors',
          recommended: true,
        },
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            if (
              node.source.value === '@/integrations/postgres/client' ||
              node.source.value.endsWith('/postgres/client')
            ) {
              context.report({
                node,
                message: 'Tidak boleh mengimpor postgresClient di lingkungan frontend. Gunakan API backend.',
              });
            }
          },
        };
      },
    },
  },
};