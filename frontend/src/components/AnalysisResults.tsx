import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SkillsRadarChart } from './SkillsRadarChart';
import { EmergingRoles } from './EmergingRoles';
import { AIImpactAnalysis } from './AIImpactAnalysis';
import { Recommendations } from './Recommendations';
import { LearningPaths } from './LearningPaths';
import { Shield, Brain, RotateCcw } from 'lucide-react';
import { auth } from '@/firebase.js';
import { Link } from 'react-router-dom';

interface LearningPath {
  title: string;
  platform: string;
  duration: string;
  link: string;
  skillAddressed: string;
}

interface AnalysisData {
  jobTitle: string;
  experienceLevel: string;
  aiRiskLevel: 'Low' | 'Medium' | 'High';
  coreSkills: string[];
  skillsAssessment: Array<{ skill: string; current: number; recommended: number }>;
  emergingRoles: Array<{ title: string; growth: number; match: number }>;
  aiImpact: {
    summary: string;
    timeline: string;
    adaptationPotential: number;
  };
  recommendations: string[];
  learningPaths?: LearningPath[];
  isFallback?: boolean;
  extractionWarning?: string;
  quotaExceeded?: boolean;
}

interface AnalysisResultsProps {
  data: AnalysisData;
  onAnalyzeAnother: () => void;
}

export const AnalysisResults = ({ data, onAnalyzeAnother }: AnalysisResultsProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-success/10 text-success border-success/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'High': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const user = auth.currentUser;
  const displayName = user?.displayName || "User";
  const email = user?.email || "No email";

  return (
    <div className="relative w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Profile Link - Fixed Top-Right */}
      <Link to="/profile" className="fixed top-4 right-4 group z-50">
        <div className="flex items-center gap-3 bg-gradient-card p-3 rounded-full shadow-card hover:shadow-glow/20 transition-smooth">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-primary text-white text-sm font-bold">
            {getInitials(displayName)}
          </div>
          <div className="hidden group-hover:block text-sm max-w-xs truncate">
            <p className="font-medium">{displayName}</p>
            <p className="text-muted-foreground">{email}</p>
          </div>
        </div>
      </Link>

      <Card className="p-8 bg-gradient-card border-border/50 shadow-card">
        {(data.isFallback || data.extractionWarning || data.quotaExceeded) && (
          <p className="text-warning mb-4">
            {data.quotaExceeded
              ? "API quota limit exceeded. Using fallback data. Please try again later or contact support."
              : data.extractionWarning || (data.isFallback && "Using fallback data due to temporary AI unavailability. Results may be less accurate.")}
          </p>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{data.jobTitle}</h1>
              <p className="text-xl text-muted-foreground">{data.experienceLevel}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${getRiskColor(data.aiRiskLevel)} border`}>
                <Shield className="w-4 h-4 mr-2" />
                AI Risk: {data.aiRiskLevel}
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                <Brain className="w-4 h-4 mr-2" />
                AI Analysis Complete
              </Badge>
            </div>
          </div>
          <Button
            onClick={onAnalyzeAnother}
            variant="outline"
            className="border-primary/30 hover:border-primary text-primary hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Analyze Another Resume
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
        <h2 className="text-xl font-semibold text-foreground mb-4">Core Skills</h2>
        <div className="flex flex-wrap gap-2">
          {data.coreSkills.map((skill, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/20"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-4">Skills Assessment</h2>
          <SkillsRadarChart data={data.skillsAssessment} />
        </Card>

        <LearningPaths learningPaths={data.learningPaths || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmergingRoles data={data.emergingRoles} />
        <AIImpactAnalysis data={data.aiImpact} />
      </div>

      <Recommendations recommendations={data.recommendations} />
    </div>
  );
};