/**
 * FAQ Bank Report Endpoint
 * 
 * GET /api/faq-report → Returns markdown report of FAQ bank status
 * 
 * Use this to:
 * - Generate snapshots before releases
 * - Debug token coverage
 * - Audit FAQ bank health
 */

import type { APIRoute } from 'astro';
import { generateFaqBankReport } from '../../data/faq/masterFaqBank';

export const GET: APIRoute = async () => {
  const report = generateFaqBankReport();
  
  return new Response(report, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'inline; filename="faq-bank-report.md"',
    },
  });
};
