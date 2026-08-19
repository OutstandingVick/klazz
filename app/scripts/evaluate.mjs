const baseUrl = process.env.KLAZZ_TEST_URL;
if (!baseUrl) throw new Error("Set KLAZZ_TEST_URL to the running Klazz application");

const expand = (category, expected, questions) => questions.map(question => ({ category, expected, question }));
const cases = [
  ...expand("stable", "Lumen Labs", ["What is our company name?","What are we called?"]),
  ...expand("stable", "Seed-stage B2B software companies", ["Who is our ideal customer?","Who do we sell to?"]),
  ...expand("stable", "$499 per month", ["What is our base price?","What does the product cost per month?"]),
  ...expand("stable", "United States and Canada", ["What is our launch region?","Which countries are we launching in?"]),
  ...expand("stable", "Web application", ["What is our primary platform?","Are we web or mobile?"]),
  ...expand("current", "October 3, 2026", ["When are we launching now?","What is the current launch date?","Tell me our launch date","When is launch?","What date are we launching?","Give me the latest launch plan","What is the active launch date?","When does Lumen Labs launch?","What launch date should I use?","When are we going live?"]),
  ...expand("historical", "September 12, 2026", ["What was our launch date in June?","What was the previous launch date?","What was our original launch date?","Historically, when were we launching?","What launch date did we use to have?","Before July, what was the launch date?","What was our launch plan in June?","What was our launch date before July?"]),
  ...expand("multi", "Hiring must wait until launch to protect the nine-month runway.", ["Why can’t we hire another engineer before launch?","Why is hiring an engineer blocked before launch?","Explain the engineer hiring constraint before launch","Why must hiring wait until launch?"]),
  ...expand("multi", "Not without board approval.", ["Can we hire an engineer before launch?"]),
  ...expand("multi", "Another engineering hire can proceed before launch only with board approval.", ["Under what condition could we approve another engineering hire?","What approval is required for another engineering hire?","Is there an exception to the engineering hiring constraint?"]),
  ...expand("multi", "The nine-month runway floor blocks another engineering hire.", ["What blocks another engineering hire before launch?","What blocks another engineering hire?"]),
  ...expand("abstention", "I don’t have a recorded company memory that answers that yet.", ["Who is our lawyer?","What is our revenue?","What is the office address?","Who is our auditor?","What is our tax ID?","Which bank do we use?"]),
];

const results = [];
for (const item of cases) {
  const response = await fetch(`${baseUrl}/api/ask`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ question:item.question }) });
  const body = await response.json();
  const passed = response.ok && String(body.answer ?? "").includes(item.expected) && Boolean(body.verification?.queryId);
  results.push({ ...item, passed, status:response.status, answer:body.answer });
}
const passed = results.filter(item => item.passed).length;
for (const result of results) console.log(`${result.passed ? "PASS" : "FAIL"} [${result.category}] ${result.question}`);
console.log(`\n${passed}/${results.length} passed`);
if (passed < 36 || results.filter(item => item.category === "abstention").some(item => !item.passed)) process.exitCode = 1;
