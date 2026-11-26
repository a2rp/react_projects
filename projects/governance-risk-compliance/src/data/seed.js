import { dateOffset } from "../utils/format";

export const frameworks = ["SOC 2", "ISO 27001", "PCI DSS", "Privacy"];

export const controlDomains = [
    "Access management",
    "Data protection",
    "Resilience",
    "Vendor oversight",
    "People and policy",
    "Change management",
];

export const controlStatuses = ["Effective", "Needs evidence", "At risk"];

export const issueStatuses = ["Open", "In review", "Remediating", "Closed"];

export const seedControls = [
    { id: "CTL-104", name: "Quarterly access recertification", domain: "Access management", framework: "SOC 2", owner: "Marcus Lee", status: "Effective", frequency: "Quarterly", nextReview: dateOffset(8), risk: "High", evidence: 4 },
    { id: "CTL-118", name: "Encryption key rotation", domain: "Data protection", framework: "ISO 27001", owner: "Priya Nair", status: "Needs evidence", frequency: "Quarterly", nextReview: dateOffset(4), risk: "Critical", evidence: 2 },
    { id: "CTL-126", name: "Production backup recovery test", domain: "Resilience", framework: "SOC 2", owner: "Daniel Wu", status: "At risk", frequency: "Monthly", nextReview: dateOffset(10), risk: "Critical", evidence: 1 },
    { id: "CTL-143", name: "Subprocessor security review", domain: "Vendor oversight", framework: "Privacy", owner: "Elena Garcia", status: "Needs evidence", frequency: "Annual", nextReview: dateOffset(14), risk: "High", evidence: 3 },
    { id: "CTL-151", name: "Security awareness completion", domain: "People and policy", framework: "ISO 27001", owner: "Mina Patel", status: "Effective", frequency: "Annual", nextReview: dateOffset(21), risk: "Medium", evidence: 5 },
    { id: "CTL-166", name: "Change approval and release log", domain: "Change management", framework: "SOC 2", owner: "Jonah Reed", status: "Effective", frequency: "Per change", nextReview: dateOffset(18), risk: "Medium", evidence: 4 },
    { id: "CTL-179", name: "Cardholder data access review", domain: "Access management", framework: "PCI DSS", owner: "Marcus Lee", status: "At risk", frequency: "Quarterly", nextReview: dateOffset(12), risk: "High", evidence: 2 },
    { id: "CTL-184", name: "Customer data retention schedule", domain: "Data protection", framework: "Privacy", owner: "Elena Garcia", status: "Effective", frequency: "Annual", nextReview: dateOffset(27), risk: "Medium", evidence: 3 },
];

export const seedAudits = [
    { id: "AUD-026", name: "SOC 2 operating effectiveness", framework: "SOC 2", lead: "Nora Bennett", status: "In progress", startDate: dateOffset(-10), dueDate: dateOffset(10), controls: ["CTL-104", "CTL-118", "CTL-126", "CTL-166"], checkedControls: ["CTL-104", "CTL-118", "CTL-166"], progress: 75 },
    { id: "AUD-031", name: "PCI DSS quarterly review", framework: "PCI DSS", lead: "Theo Martin", status: "Scheduled", startDate: dateOffset(5), dueDate: dateOffset(19), controls: ["CTL-179", "CTL-104"], checkedControls: [], progress: 0 },
    { id: "AUD-019", name: "Subprocessor privacy assessment", framework: "Privacy", lead: "Amara Okafor", status: "In progress", startDate: dateOffset(-6), dueDate: dateOffset(14), controls: ["CTL-143", "CTL-184"], checkedControls: ["CTL-143"], progress: 50 },
    { id: "AUD-014", name: "ISO 27001 internal audit", framework: "ISO 27001", lead: "Nora Bennett", status: "Complete", startDate: dateOffset(-70), dueDate: dateOffset(-45), controls: ["CTL-151", "CTL-118"], checkedControls: ["CTL-151", "CTL-118"], progress: 100 },
];

export const seedIssues = [
    { id: "FND-284", title: "Recovery evidence missing from latest failover test", severity: "Critical", likelihood: "Likely", domain: "Resilience", owner: "Daniel Wu", dueDate: dateOffset(3), status: "Remediating", controlId: "CTL-126", description: "The recovery runbook was not attached to the latest production restore exercise." },
    { id: "FND-279", title: "Key rotation approval trail incomplete", severity: "High", likelihood: "Possible", domain: "Data protection", owner: "Priya Nair", dueDate: dateOffset(6), status: "In review", controlId: "CTL-118", description: "The previous rotation is complete, but the approval record is missing from the evidence set." },
    { id: "FND-271", title: "Two dormant administrator accounts remain active", severity: "High", likelihood: "Likely", domain: "Access management", owner: "Marcus Lee", dueDate: dateOffset(8), status: "Open", controlId: "CTL-179", description: "The quarterly review flagged accounts that have not been used in more than 90 days." },
    { id: "FND-263", title: "Subprocessor review needs updated DPA", severity: "Medium", likelihood: "Possible", domain: "Vendor oversight", owner: "Elena Garcia", dueDate: dateOffset(15), status: "Open", controlId: "CTL-143", description: "One vendor has not returned the current data processing addendum." },
    { id: "FND-251", title: "Release ticket missing rollback confirmation", severity: "Medium", likelihood: "Unlikely", domain: "Change management", owner: "Jonah Reed", dueDate: dateOffset(18), status: "In review", controlId: "CTL-166", description: "The release record has approval but does not document a rollback check." },
    { id: "FND-244", title: "Annual awareness evidence not linked to roster", severity: "Low", likelihood: "Unlikely", domain: "People and policy", owner: "Mina Patel", dueDate: dateOffset(-4), status: "Closed", controlId: "CTL-151", description: "Training completion is confirmed and now linked to the active employee roster." },
];
