import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Clock, Award, Target } from 'lucide-react';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Bar, 
  Line, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

// Update the color constants with lighter, more readable colors
const CHART_COLORS = {
  difficulty: {
    Easy: '#86efac',    // light green
    Medium: '#fde047',  // light yellow
    Hard: '#fca5a5'     // light red
  },
  languages: [
    '#93c5fd',  // light blue
    '#c4b5fd',  // light purple
    '#fbcfe8',  // light pink
    '#fdba74',  // light orange
    '#bef264'   // light lime
  ],
  submissions: {
    Accepted: '#86efac',      // light green
    'Wrong Answer': '#fca5a5', // light red
    'Time Limit': '#fde047',   // light yellow
    'Runtime Error': '#fdba74' // light orange
  }
};

// Mock data for analytics
const mockAnalytics = {
  participationData: [
    { hour: '00:00', participants: 12 },
    { hour: '04:00', participants: 15 },
    { hour: '08:00', participants: 45 },
    { hour: '12:00', participants: 78 },
    { hour: '16:00', participants: 89 },
    { hour: '20:00', participants: 67 },
  ],
  difficultyDistribution: [
    { difficulty: 'Easy', count: 45, percentage: 35 },
    { difficulty: 'Medium', count: 65, percentage: 50 },
    { difficulty: 'Hard', count: 20, percentage: 15 },
  ],
  submissionStats: [
    { name: 'Accepted', value: 156 },
    { name: 'Wrong Answer', value: 89 },
    { name: 'Time Limit', value: 34 },
    { name: 'Runtime Error', value: 21 },
  ],
  languageUsage: [
    { language: 'JavaScript', submissions: 89 },
    { language: 'Python', submissions: 76 },
    { language: 'Java', submissions: 45 },
    { language: 'C++', submissions: 34 },
  ],
};

// Custom label component for better text visibility
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, fill }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7; // Increased radius for better positioning
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const percentage = (percent * 100).toFixed(0);

  return (
    <>
      <text
        x={x}
        y={y}
        fill="#000000" // Dark text for better contrast
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${name} ${percentage}%`}
      </text>
      {/* Add a white background behind text for better readability */}
      <rect
        x={x - 30}
        y={y - 10}
        width="60"
        height="20"
        fill="white"
        opacity="0.7"
      />
    </>
  );
};

const ContestAnalytics: React.FC = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/contests')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contests
          </Button>

          <div className="grid gap-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Users className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Participants</p>
                      <h3 className="text-2xl font-bold">130</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
                      <h3 className="text-2xl font-bold">45m</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Award className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <h3 className="text-2xl font-bold">52%</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Target className="h-6 w-6 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Score</p>
                      <h3 className="text-2xl font-bold">324</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Participation Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Participation Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockAnalytics.participationData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                      <XAxis 
                        dataKey="hour" 
                        tick={{ fill: '#000000', fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fill: '#000000', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="participants" 
                        stroke="#93c5fd"
                        strokeWidth={3}
                        dot={{ fill: '#93c5fd', strokeWidth: 2 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockAnalytics.difficultyDistribution}
                          dataKey="percentage"
                          nameKey="difficulty"
                          cx="50%"
                          cy="50%"
                          outerRadius={100} // Increased size
                          innerRadius={60}  // Added inner radius for donut style
                          labelLine={false}
                          label={CustomLabel}
                        >
                          {mockAnalytics.difficultyDistribution.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={CHART_COLORS.difficulty[entry.difficulty as keyof typeof CHART_COLORS.difficulty]}
                              stroke="#ffffff" // Add white borders
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Language Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Language Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockAnalytics.languageUsage}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                        <XAxis 
                          dataKey="language" 
                          tick={{ fill: '#000000', fontSize: 12 }}
                          tickLine={{ stroke: '#000000' }}
                        />
                        <YAxis 
                          tick={{ fill: '#000000', fontSize: 12 }}
                          tickLine={{ stroke: '#000000' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{
                            paddingTop: '20px',
                            fontSize: '12px'
                          }}
                        />
                        {mockAnalytics.languageUsage.map((entry, index) => (
                          <Bar 
                            key={`bar-${index}`}
                            dataKey="submissions"
                            fill={CHART_COLORS.languages[index % CHART_COLORS.languages.length]}
                            stroke="#ffffff"
                            strokeWidth={1}
                            radius={[4, 4, 0, 0]} // Rounded corners
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submission Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockAnalytics.submissionStats}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                        label={CustomLabel}
                      >
                        {mockAnalytics.submissionStats.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CHART_COLORS.submissions[entry.name as keyof typeof CHART_COLORS.submissions]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContestAnalytics;
