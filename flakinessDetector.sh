# run everything many times and fail fast, for detecting and checking if flakiness is really gone 
for i in {1..20}; do
  echo "=== Run no. $i ==="
  npx playwright test --workers=1 || break
done
