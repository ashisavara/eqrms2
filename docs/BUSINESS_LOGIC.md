# Business Logic Documentation

## Domain Models

### Company
- Core entity representing client companies
- Contains company profile, contact info, and compliance status
- Related to multiple ValScreen entries

### ValScreen
- Validation and screening records
- Tracks compliance checks and risk assessments
- Linked to specific companies

### Risk Management
- Risk scoring system
- Compliance tracking
- Alert mechanisms

## Business Rules

### Company Validation
1. Required fields:
   - Company name
   - Registration number
   - Primary contact
   - Risk category

2. Validation rules:
   - Registration number format validation
   - Email format validation
   - Phone number format validation

### Risk Assessment
1. Risk Scoring:
   - Industry factor
   - Geographic factor
   - Transaction history
   - Compliance history

2. Alert Triggers:
   - High-risk transactions
   - Missing documentation
   - Compliance deadlines

## Workflows

### New Company Onboarding
1. Initial registration
2. Document collection
3. Risk assessment
4. Approval process

### Periodic Review
1. Annual review trigger
2. Document updates
3. Risk reassessment
4. Compliance check 