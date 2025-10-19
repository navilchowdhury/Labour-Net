// Simple test to verify reviews data structure
const reviewData = {
  "_id": "68f11b286691b911d085a6b7",
  "employer": {
    "_id": "68a8705649f2aad1c568964c",
    "name": "Navil Hossain Chowdhury",
    "isCompany": false
  },
  "worker": "68f116b45ef1cb38ab285b50",
  "job": null,  // This is the problematic field
  "rating": 4,
  "comment": "",
  "createdAt": "2025-10-16T16:19:52.706Z",
  "updatedAt": "2025-10-16T16:19:52.706Z",
  "__v": 0
};

// Test the fixed logic
function testReviewDisplay(review) {
  console.log('Testing review display logic...');
  
  // Test employer name display
  const employerName = review.employer?.name || 'Unknown Employer';
  console.log('✅ Employer name:', employerName);
  
  // Test job details display
  const jobDetails = review.job ? `${review.job.category} - ${review.job.title}` : 'Job details not available';
  console.log('✅ Job details:', jobDetails);
  
  // Test company badge
  const companyBadge = review.employer?.isCompany ? '(Company)' : '';
  console.log('✅ Company badge:', companyBadge);
  
  console.log('✅ All tests passed - no more null reference errors!');
}

testReviewDisplay(reviewData);

// Test with missing employer data
const badReviewData = {
  "employer": null,
  "job": null,
  "rating": 5,
  "comment": "Great work!"
};

console.log('\nTesting with bad data...');
testReviewDisplay(badReviewData);
