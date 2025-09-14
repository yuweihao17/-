
import { GoogleGenAI } from "@google/genai";
import { RepairRequest, HygieneCheck, Visitor } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Smart features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateDashboardSummary = async (
  repairs: RepairRequest[],
  hygieneChecks: HygieneCheck[],
  visitors: Visitor[],
  language: 'en' | 'zh'
): Promise<string> => {
  if (!API_KEY) {
    return language === 'zh' 
      ? "未配置 Gemini API 密钥，无法生成摘要。" 
      : "Gemini API key is not configured. Cannot generate summary.";
  }

  const prompt = language === 'zh'
  ? `
    作为宿舍管理助手，根据以下 JSON 数据生成一份简洁、专业的摘要。
    请不要使用问候语或客套话，直接切入主题。使用项目符号列出关键指标。

    **今日数据:**
    - 维修请求: ${JSON.stringify(repairs)}
    - 卫生检查: ${JSON.stringify(hygieneChecks)}
    - 访客记录: ${JSON.stringify(visitors)}

    **指令:**
    1.  用一句话概述当前的宿舍状况。
    2.  提供一个关键洞察的项目符号列表。
    3.  突出显示任何紧急事项（例如，待处理的维修）。
    4.  提及一个积极的方面（例如，高卫生评分）。
    5.  将整个摘要保持在 150 字以内。
    `
  : `
    As a dormitory management assistant, generate a concise, professional summary based on the following data.
    Do not greet me or use conversational fluff. Get straight to the point. Use bullet points for key metrics.

    **Today's Data:**
    - Repair Requests: ${JSON.stringify(repairs)}
    - Hygiene Checks: ${JSON.stringify(hygieneChecks)}
    - Visitors: ${JSON.stringify(visitors)}

    **Instructions:**
    1.  Start with a one-sentence overview of the current dormitory status.
    2.  Provide a bulleted list of key insights.
    3.  Highlight any urgent matters (e.g., pending repairs).
    4.  Mention one positive point (e.g., high hygiene scores).
    5.  Keep the entire summary under 100 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    return language === 'zh' 
      ? "因发生错误，无法生成 AI 摘要。" 
      : "Could not generate AI summary due to an error.";
  }
};
