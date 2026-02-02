// Korean Military Service Calculator

export interface MilitaryServiceResult {
  eligible: boolean;
  serviceType: string;
  duration: string;
  ageStatus: string;
  exemptionInfo?: string;
  healthGrade: string;
  tips: string[];
  timeline: {
    enlistmentAge: string;
    completionAge: string;
  };
}

export interface HealthCondition {
  id: string;
  name: string;
  description: string;
  grade: number; // 1-7
}

// Common health conditions affecting military service
export const HEALTH_CONDITIONS: HealthCondition[] = [
  { id: 'none', name: 'No Health Issues', description: 'Completely healthy', grade: 1 },
  { id: 'minor', name: 'Minor Health Issues', description: 'Minor allergies, corrected vision', grade: 2 },
  { id: 'moderate', name: 'Moderate Conditions', description: 'Asthma, flat feet, color blindness', grade: 3 },
  { id: 'significant', name: 'Significant Conditions', description: 'Chronic conditions requiring treatment', grade: 4 },
  { id: 'severe', name: 'Severe Conditions', description: 'Major health issues limiting physical activity', grade: 5 },
  { id: 'very_severe', name: 'Very Severe', description: 'Serious medical conditions', grade: 6 },
  { id: 'exempt', name: 'Exemption Level', description: 'Severe disabilities or chronic illness', grade: 7 },
];

// Military service types based on branch
export const SERVICE_TYPES = {
  army: {
    name: 'Army (육군)',
    duration: '18 months',
    description: 'Ground forces, most common service',
    requirements: 'Health Grade 1-3',
  },
  navy: {
    name: 'Navy (해군)',
    duration: '20 months',
    description: 'Naval forces and operations',
    requirements: 'Health Grade 1-3, swimming ability helpful',
  },
  airForce: {
    name: 'Air Force (공군)',
    duration: '21 months',
    description: 'Aerial defense and operations',
    requirements: 'Health Grade 1-2, higher academic scores',
  },
  marines: {
    name: 'Marines (해병대)',
    duration: '18 months',
    description: 'Elite amphibious forces',
    requirements: 'Health Grade 1-2, excellent physical condition',
  },
  alternative: {
    name: 'Alternative Service (대체복무)',
    duration: '21-36 months',
    description: 'Public service, social work, or industrial support',
    requirements: 'Health Grade 4, special circumstances',
  },
  exempted: {
    name: 'Exempted (면제)',
    duration: 'N/A',
    description: 'Exempt from military service',
    requirements: 'Health Grade 5-7, or special exemptions',
  },
};

export function calculateMilitaryService(
  age: number,
  healthGrade: number,
  preferredBranch: keyof typeof SERVICE_TYPES
): MilitaryServiceResult {
  // Age eligibility check (18-35)
  const eligible = age >= 18 && age <= 35;
  
  // Determine service type based on health grade
  let serviceType = SERVICE_TYPES.army.name;
  let duration = SERVICE_TYPES.army.duration;
  let healthGradeText = '';
  
  if (healthGrade >= 5) {
    // Exemption
    serviceType = SERVICE_TYPES.exempted.name;
    duration = SERVICE_TYPES.exempted.duration;
    healthGradeText = 'Grade 5-7 (Exempted)';
  } else if (healthGrade === 4) {
    // Alternative service
    serviceType = SERVICE_TYPES.alternative.name;
    duration = SERVICE_TYPES.alternative.duration;
    healthGradeText = 'Grade 4 (Alternative Service)';
  } else {
    // Regular service based on preferred branch
    const branch = SERVICE_TYPES[preferredBranch];
    if (branch && healthGrade <= 3) {
      // Air Force and Marines require better health
      if ((preferredBranch === 'airForce' || preferredBranch === 'marines') && healthGrade > 2) {
        serviceType = SERVICE_TYPES.army.name;
        duration = SERVICE_TYPES.army.duration;
        healthGradeText = 'Grade 3 (Army - health requirements for Air Force/Marines not met)';
      } else {
        serviceType = branch.name;
        duration = branch.duration;
        healthGradeText = `Grade ${healthGrade} (${branch.name})`;
      }
    } else {
      healthGradeText = `Grade ${healthGrade} (Army)`;
    }
  }
  
  // Age status
  let ageStatus = '';
  if (age < 18) {
    ageStatus = 'Too young - Not yet eligible';
  } else if (age >= 18 && age <= 20) {
    ageStatus = 'Eligible soon - Can enlist now or wait';
  } else if (age >= 21 && age <= 28) {
    ageStatus = 'Prime enlistment age - Must enlist by 28';
  } else if (age >= 29 && age <= 35) {
    ageStatus = 'Urgent - Must enlist immediately or face penalties';
  } else {
    ageStatus = 'Overdue - Legal consequences apply';
  }
  
  // Tips based on situation
  const tips: string[] = [];
  
  if (age < 19) {
    tips.push('🎓 Finish high school before enlisting');
    tips.push('💪 Start building physical fitness now');
    tips.push('📚 Consider university deferment options');
  } else if (age >= 19 && age <= 24) {
    tips.push('🎓 University students can defer until graduation (max age 28)');
    tips.push('🌐 Apply for KATUSA (Korean Augmentation to US Army) if English proficient');
    tips.push('💼 Some companies offer military-friendly employment');
  } else if (age >= 25 && age <= 28) {
    tips.push('⏰ Plan your enlistment timing carefully');
    tips.push('💼 Notify your employer well in advance');
    tips.push('📝 Complete any professional certifications before service');
  } else if (age >= 29) {
    tips.push('🚨 Enlist immediately to avoid legal penalties');
    tips.push('⚖️ Late enlistment may result in travel bans');
    tips.push('📞 Contact Military Manpower Administration urgently');
  }
  
  // Health-based tips
  if (healthGrade <= 2) {
    tips.push('✅ Excellent health - eligible for all branches');
    tips.push('🎯 Consider competitive branches (Air Force, KATUSA)');
  } else if (healthGrade === 3) {
    tips.push('✅ Good health - eligible for Army and Navy');
    tips.push('🏥 Some restrictions may apply to special units');
  } else if (healthGrade === 4) {
    tips.push('🔄 Alternative service options available');
    tips.push('🏢 Public service or industrial support roles');
  } else {
    tips.push('✋ Exempted from military service');
    tips.push('📋 Keep exemption documentation safe');
  }
  
  // Calculate timeline
  const enlistmentAge = age < 21 ? '19-21' : `${age}`;
  const durationMonths = parseInt(duration.split(' ')[0]) || 0;
  const completionAge = age < 35 ? `${age + Math.ceil(durationMonths / 12)}` : 'N/A';
  
  return {
    eligible,
    serviceType,
    duration,
    ageStatus,
    exemptionInfo: healthGrade >= 5 ? 'You are exempt from military service due to health grade 5-7.' : undefined,
    healthGrade: healthGradeText,
    tips,
    timeline: {
      enlistmentAge,
      completionAge,
    },
  };
}

export function getServiceBranchInfo(branch: keyof typeof SERVICE_TYPES) {
  return SERVICE_TYPES[branch];
}

export function getAllServiceBranches() {
  return Object.entries(SERVICE_TYPES).map(([key, value]) => ({
    key: key as keyof typeof SERVICE_TYPES,
    ...value,
  }));
}
