export type TRFP = {
  id: string;
  name: string;
  orgId: string;
  dataFolderId: string;
  createdBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  latestVersion: {
    id: string;
    rfpId: string;
    summary: {
      title?: string;
      keyDates?: {
        issueDate?: string;
        submissionDeadline?: string | null;
        qnaDeadline?: string | null;
        awardDate?: string | null;
        otherDates?: {
          date: string;
          description: string;
        }[];
      };
      overview?: string | null;
      coverLetter?: string | null;
      executiveSummary?: string | null;
      discrepancies?: {
        description: string;
        type: any;
      }[];
      questions?: string[];
      scopeOfWork?: string | null;
      submissionRequirements?: string[];
      evaluationCriteria?: string | null;
      otherInfo?: {
        key: string;
        value: string;
        type: 'AI_TEXT' | 'MANUAL';
      }[];
    };
    inputFileKeys: [string];
    responseContent: {
      intro: {
        companyName: string;
        projectTitle: string;
        executiveSummary: string;
        images: {
          additionalProp1: string;
          additionalProp2: string;
          additionalProp3: string;
        };
      };
      coverPage: {
        proposalTitle: string;
        clientName: string;
        submissionDate: string;
        submittedBy: string;
        contactPerson: {
          name: string;
          email: string;
          phone: string;
        };
      };
      caseStudies: [
        {
          projectName: string;
          client: string;
          industry: string;
          problemStatement: string;
          ourSolution: string;
          results: string;
        },
      ];
      teamBios: [
        {
          name: string;
          role: string;
          experienceSummary: string;
          keySkills: [string];
        },
      ];
      projectScope: {
        scopeSummary: string;
        inclusions: [string];
        exclusions: [string];
        deliverables: [string];
        milestones: [
          {
            milestoneName: string;
            completionDate: string;
          },
        ];
      };
      contactUs: {
        sectionTitle: string;
        contacts: [
          {
            name: string;
            title: string;
            email: string;
            phone: string;
          },
        ];
      };
      aboutCompany: {
        companyName: string;
        missionStatement: string;
        history: string;
        keyAchievements: [string];
      };
      sustainabilityInfo: {
        sectionTitle: string;
        commitments: [string];
        certifications: [
          {
            name: string;
            issueDate: string;
          },
        ];
        initiatives: [
          {
            initiativeName: string;
            description: string;
          },
        ];
      };
      policiesInfo: {
        sectionTitle: string;
        securityPolicy: {
          title: string;
          summary: string;
          certifications: [string];
        };
        privacyPolicy: {
          title: string;
          summary: string;
          compliance: [string];
        };
        otherPolicies: [
          {
            policyName: string;
            summary: string;
          },
        ];
      };
      tnc: [
        {
          sectionTitle: string;
          summary: string;
          serviceLevelAgreement: {
            uptimeGuarantee: string;
            responseTime: string;
            penalty: string;
          };
          paymentTerms: string;
          contractDuration: string;
        },
      ];
    };
    template: string;
    status: string;
    version: number;
    createdBy: string;
    createdAt: string;
  };
};
