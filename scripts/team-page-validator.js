/**
 * Team Page Validation System with 0/1 Conference Grading
 * Product Manager Systematic Approach for Sports Betting Tool
 */

const { NCAA_DIVISION_I_TEAMS, TeamPageUtils } = require('../data/ncaa-teams-database.js');
const fs = require('fs');

class TeamPageValidator {
  
  constructor() {
    this.validationResults = {};
    this.overallScore = 0;
  }

  /**
   * Grade each conference on 0/1 scale - either all teams present or not
   */
  async gradeConferenceCompleteness() {
    console.log('🏆 CONFERENCE COMPLETENESS GRADING (0/1 SCALE)');
    console.log('=' .repeat(60));
    
    const results = {};
    let totalScore = 0;
    let conferenceCount = 0;

    // Known expected team counts for accurate grading
    const expectedCounts = {
      'SEC': 16, 'Big Ten': 18, 'Big 12': 16, 'ACC': 17,
      'American Athletic': 14, 'Mountain West': 12, 'MAC': 12,
      'Sun Belt': 14, 'Conference USA': 10, 'FBS Independents': 7
    };

    for (const [conference, data] of Object.entries(NCAA_DIVISION_I_TEAMS.FBS)) {
      const actualCount = data.teams.length;
      const expectedCount = expectedCounts[conference] || data.conferenceInfo.expectedTeamCount;
      const isComplete = actualCount >= expectedCount;
      const grade = isComplete ? 1 : 0;
      
      results[conference] = {
        grade: grade,
        actualTeamCount: actualCount,
        expectedTeamCount: expectedCount,
        isComplete: isComplete,
        teams: data.teams.map(team => ({
          school: team.school,
          mascot: team.mascot,
          abbreviation: team.abbreviation,
          state: team.state
        })),
        bettingRelevance: data.conferenceInfo.bettingRelevance
      };

      totalScore += grade;
      conferenceCount++;

      console.log(`${isComplete ? '✅' : '❌'} ${conference.padEnd(20)} | Grade: ${grade} | Teams: ${actualCount}/${expectedCount} | ${data.conferenceInfo.bettingRelevance} Priority`);
    }

    const overallGrade = totalScore / conferenceCount;
    this.overallScore = overallGrade;
    
    console.log('\n📊 FINAL CONFERENCE GRADING REPORT:');
    console.log(`🎯 Complete Conferences: ${totalScore}/${conferenceCount}`);
    console.log(`📈 Overall Grade: ${(overallGrade * 100).toFixed(1)}%`);
    console.log(`🏈 Total Teams: ${TeamPageUtils.getAllFBSTeams().length}`);
    
    return {
      conferenceResults: results,
      summary: {
        completeConferences: totalScore,
        totalConferences: conferenceCount,
        overallGrade: overallGrade,
        totalTeams: TeamPageUtils.getAllFBSTeams().length
      }
    };
  }

  /**
   * Validate that each team has required data for betting tool
   */
  validateTeamDataCompleteness() {
    console.log('\n🔍 TEAM DATA COMPLETENESS VALIDATION');
    console.log('=' .repeat(50));
    
    const requiredFields = ['school', 'mascot', 'city', 'state', 'abbreviation'];
    const allTeams = TeamPageUtils.getAllFBSTeams();
    const validationResults = {};
    let completeTeams = 0;

    allTeams.forEach(team => {
      const missingFields = requiredFields.filter(field => !team[field]);
      const isComplete = missingFields.length === 0;
      
      validationResults[team.school] = {
        isComplete: isComplete,
        completenessScore: isComplete ? 1 : 0,
        missingFields: missingFields,
        conference: team.conference,
        bettingPriority: team.bettingRelevance
      };

      if (isComplete) completeTeams++;
    });

    const completenessRate = completeTeams / allTeams.length;
    
    console.log(`✅ Complete Teams: ${completeTeams}/${allTeams.length}`);
    console.log(`📊 Data Completeness: ${(completenessRate * 100).toFixed(1)}%`);
    
    // Show any teams with missing data
    const incompleteTeams = Object.entries(validationResults)
      .filter(([_, data]) => !data.isComplete);
    
    if (incompleteTeams.length > 0) {
      console.log('\n⚠️  Teams with missing data:');
      incompleteTeams.forEach(([team, data]) => {
        console.log(`   - ${team}: Missing ${data.missingFields.join(', ')}`);
      });
    }

    return {
      teamValidation: validationResults,
      summary: {
        completeTeams,
        totalTeams: allTeams.length,
        completenessRate,
        incompleteTeams: incompleteTeams.length
      }
    };
  }

  /**
   * Generate systematic implementation roadmap
   */
  generateImplementationRoadmap() {
    console.log('\n📋 SYSTEMATIC IMPLEMENTATION ROADMAP');
    console.log('=' .repeat(50));
    
    const bettingPriorities = TeamPageUtils.getTeamsByBettingPriority();
    
    const roadmap = {
      phase1_highest_priority: {
        description: "Top-tier betting conferences (SEC, Big Ten)",
        conferences: ['SEC', 'Big Ten'],
        teamCount: bettingPriorities.HIGHEST.length,
        estimatedEffort: "2-3 weeks",
        criticalFeatures: [
          "Live odds integration",
          "SP+ ratings display", 
          "Advanced analytics",
          "Real-time injury reports",
          "Betting line movements"
        ]
      },
      
      phase2_high_priority: {
        description: "Major betting conferences (Big 12, ACC)",
        conferences: ['Big 12', 'ACC'],
        teamCount: bettingPriorities.HIGH.length,
        estimatedEffort: "2 weeks", 
        criticalFeatures: [
          "Conference standings",
          "Head-to-head records",
          "Recruiting rankings",
          "Coaching changes tracking"
        ]
      },
      
      phase3_medium_priority: {
        description: "G5 conferences with betting action",
        conferences: ['American Athletic', 'Mountain West', 'MAC', 'Sun Belt', 'Conference USA'],
        teamCount: bettingPriorities.MEDIUM.length,
        estimatedEffort: "3 weeks",
        criticalFeatures: [
          "Basic team stats",
          "Schedule integration", 
          "Player rosters",
          "Venue information"
        ]
      },
      
      phase4_independents: {
        description: "Independent teams (variable betting relevance)",
        conferences: ['FBS Independents'],
        teamCount: bettingPriorities.VARIABLE?.length || 0,
        estimatedEffort: "1 week",
        criticalFeatures: [
          "Special scheduling considerations",
          "Unique betting patterns",
          "Conference affiliation tracking"
        ]
      }
    };

    console.log('\n🚀 PHASED IMPLEMENTATION PLAN:');
    Object.entries(roadmap).forEach(([phase, details]) => {
      console.log(`\n${phase.toUpperCase().replace('_', ' ')}: ${details.description}`);
      console.log(`   📊 Teams: ${details.teamCount}`);
      console.log(`   ⏱️  Timeline: ${details.estimatedEffort}`);
      console.log(`   🎯 Features: ${details.criticalFeatures.join(', ')}`);
    });

    return roadmap;
  }

  /**
   * Run comprehensive validation and generate report
   */
  async runFullValidation() {
    console.log('🏈 COMPREHENSIVE TEAM PAGE VALIDATION SYSTEM');
    console.log('🎯 Product Manager Systematic Approach for 200+ NCAA Teams');
    console.log('=' .repeat(80));
    
    try {
      // Phase 1: Conference completeness grading
      const conferenceResults = await this.gradeConferenceCompleteness();
      
      // Phase 2: Team data validation
      const teamResults = this.validateTeamDataCompleteness();
      
      // Phase 3: Implementation roadmap
      const roadmap = this.generateImplementationRoadmap();
      
      // Generate comprehensive report
      const fullReport = {
        timestamp: new Date().toISOString(),
        validationType: 'COMPREHENSIVE_TEAM_PAGE_VALIDATION',
        conferenceGrading: conferenceResults,
        teamDataValidation: teamResults,
        implementationRoadmap: roadmap,
        summary: {
          totalConferences: Object.keys(NCAA_DIVISION_I_TEAMS.FBS).length,
          completeConferences: conferenceResults.summary.completeConferences,
          conferenceCompleteness: conferenceResults.summary.overallGrade,
          totalTeams: teamResults.summary.totalTeams,
          completeTeams: teamResults.summary.completeTeams,
          teamDataCompleteness: teamResults.summary.completenessRate,
          readyForImplementation: conferenceResults.summary.overallGrade >= 0.9 && teamResults.summary.completenessRate >= 0.9
        }
      };

      // Save detailed report
      fs.writeFileSync('team-validation-report.json', JSON.stringify(fullReport, null, 2));
      
      console.log('\n🎉 VALIDATION COMPLETE!');
      console.log(`📊 Conference Grade: ${(fullReport.summary.conferenceCompleteness * 100).toFixed(1)}%`);
      console.log(`📈 Team Data Grade: ${(fullReport.summary.teamDataCompleteness * 100).toFixed(1)}%`);
      console.log(`🚀 Ready for Implementation: ${fullReport.summary.readyForImplementation ? 'YES ✅' : 'NO ❌'}`);
      console.log(`💾 Full report saved to: team-validation-report.json`);
      
      return fullReport;
      
    } catch (error) {
      console.error('💥 Validation failed:', error);
      throw error;
    }
  }
}

// Execute if run directly
if (require.main === module) {
  const validator = new TeamPageValidator();
  validator.runFullValidation()
    .then(report => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}

module.exports = TeamPageValidator;