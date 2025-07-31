import { getCompanyData } from './companyService';



/**
 * افزودن ID شرکت به انتهای مسیر URL
 * مثال: /api/category → /api/category/2
 */
export const appendCompanyIdToUrl = async (basePath) => {
  const company = await getCompanyData();
  if (!company) throw new Error('company data not found');
  return `${basePath}/${company.id}`;
};
