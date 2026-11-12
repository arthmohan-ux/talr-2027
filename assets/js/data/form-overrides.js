/*
  01-company-industry-fix
  Rewrites the industry of named companies without touching the big table in form-data.js.
  Add a line here when a real company shows the wrong industry. Keys must match the company name exactly.
  The block logs how many entries it touched and warns on any key that matched nothing,
  so a rename upstream is loud rather than silent.

  Industry codes: 1 IT Services, 2 SaaS & Software Products, 3 HR Tech, 4 Staffing & HR Services, 5 BFSI,
  6 Fintech, 7 Consulting & Professional Services, 8 Manufacturing & Industrial, 9 Automotive,
  10 Healthcare & Pharma, 11 Retail & E-commerce, 12 FMCG & Consumer Goods, 13 Telecom & Media,
  14 Energy & Utilities, 15 Logistics & Mobility, 16 Travel & Hospitality, 17 Education & EdTech,
  18 Government & Non-profit
*/
(function () {
  var FIX = {
    /* "Company name": industryCode, */
  };
  var D = window.TAD_FORM_DATA;
  if (!D) return;
  var keys = Object.keys(FIX), hit = {};
  D.COMPANIES.forEach(function (c) { if (FIX.hasOwnProperty(c.name)) { c.ind = FIX[c.name]; hit[c.name] = 1; } });
  var missed = keys.filter(function (k) { return !hit[k]; });
  if (keys.length) console.info('[01-company-industry-fix] corrected ' + (keys.length - missed.length) + ' of ' + keys.length);
  if (missed.length) console.warn('[01-company-industry-fix] no company matched: ' + missed.join(', '));
})();
