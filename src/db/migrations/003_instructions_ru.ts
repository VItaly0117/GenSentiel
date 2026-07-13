export const migration003 = `
-- ============================================
-- 003_instructions_ru: Russian exercise instructions
-- ============================================

ALTER TABLE exercises ADD COLUMN instructions_ru TEXT;
`;
