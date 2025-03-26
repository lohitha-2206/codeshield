
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Clock, Code, Users } from 'lucide-react';
import { Contest } from '@/lib/types';

interface ContestCardProps {
  contest: Contest;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  // Format date to display in a readable format
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine badge color based on contest status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'secondary';
      case 'active':
        return 'default';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Determine action button based on contest status
  const getActionButton = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <Button className="w-full" variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Remind Me
          </Button>
        );
      case 'active':
        return (
          <Button className="w-full bg-gradient-to-r from-shield-blue to-shield-teal hover:opacity-90 transition-opacity">
            <Flame className="h-4 w-4 mr-2" />
            Join Now
          </Button>
        );
      case 'completed':
        return (
          <Button className="w-full" variant="outline">
            <Code className="h-4 w-4 mr-2" />
            View Results
          </Button>
        );
      default:
        return (
          <Button className="w-full" variant="secondary">
            View Details
          </Button>
        );
    }
  };

  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant={getBadgeVariant(contest.status)} className="mb-2">
              {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
            </Badge>
            <h3 className="text-lg font-semibold">{contest.title}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {contest.description}
        </p>
        <div className="flex items-center justify-start text-xs text-muted-foreground gap-4">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatDate(contest.startDate)}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>{contest.participants} participants</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {contest.languages.slice(0, 3).map((lang) => (
            <Badge key={lang} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
              {lang}
            </Badge>
          ))}
          {contest.languages.length > 3 && (
            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
              +{contest.languages.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/contests/${contest.id}`} className="w-full">
          {getActionButton(contest.status)}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ContestCard;
