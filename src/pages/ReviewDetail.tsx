
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ExternalLink, FileText, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { mockReviews } from "@/data/mockData";
import QualityScoreDisplay from "@/components/QualityScoreDisplay";
import FindingCard from "@/components/FindingCard";
import QualityRadarChart from "@/components/QualityRadarChart";

const ReviewDetail = () => {
  const { id } = useParams();
  const review = mockReviews.find(r => r.id === id);
  
  if (!review) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Review not found</h2>
          <p className="text-slate-600 mb-4">The requested PR review could not be found.</p>
          <Button asChild>
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4 -ml-2">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 leading-tight">{review.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base text-slate-600">
                <span>{review.repository}</span>
                <span className="hidden sm:inline">•</span>
                <span>by {review.author}</span>
                <span className="hidden sm:inline">•</span>
                <span>{review.date}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <QualityScoreDisplay score={review.qualityScore} size="lg" showLabel />
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={review.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View PR
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Status and Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Status</p>
                  <Badge 
                    variant={review.status === 'completed' ? 'default' : 
                            review.status === 'in-progress' ? 'secondary' : 'destructive'}
                    className="mt-1 text-xs"
                  >
                    {review.status}
                  </Badge>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Files Analyzed</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{review.filesAnalyzed}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Lines of Code</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{review.linesOfCode}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-600">Total Findings</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{review.findings.length}</p>
                </div>
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">Overview</TabsTrigger>
            <TabsTrigger value="findings" className="text-xs sm:text-sm px-2 py-2">
              Findings <span className="hidden sm:inline">({review.findings.length})</span>
            </TabsTrigger>
            <TabsTrigger value="semantic" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Semantic </span>Analysis
            </TabsTrigger>
            <TabsTrigger value="files" className="text-xs sm:text-sm px-2 py-2">
              Files <span className="hidden sm:inline">({review.filesAnalyzed})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quality Metrics */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <QualityRadarChart quality={review.quality} />
                </CardContent>
              </Card>

              {/* Top Recommendations */}
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Top Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {review.semantic.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-slate-700">{suggestion}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Critical Findings */}
            {review.findings.filter(f => f.severity === 'critical' || f.severity === 'high').length > 0 && (
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-red-700 text-lg sm:text-xl">Critical & High Priority Findings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {review.findings
                    .filter(f => f.severity === 'critical' || f.severity === 'high')
                    .map(finding => (
                      <FindingCard key={finding.id} finding={finding} />
                    ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="findings" className="space-y-4">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">All Findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {review.findings.map(finding => (
                  <FindingCard key={finding.id} finding={finding} detailed />
                ))}
                
                {review.findings.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No issues found</h3>
                    <p className="text-slate-600">This PR passed all quality checks successfully.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="semantic" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">AI Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{review.semantic.summary}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Impact Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{review.semantic.impact}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Files Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...new Set(review.findings.map(f => f.file))].map(file => {
                    const fileFindings = review.findings.filter(f => f.file === file);
                    return (
                      <div key={file} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-200 rounded-lg gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <FileText className="h-5 w-5 text-slate-400 flex-shrink-0" />
                          <span className="font-mono text-xs sm:text-sm truncate">{file}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {fileFindings.length > 0 ? (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 text-xs">
                              {fileFindings.length} issue{fileFindings.length !== 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                              Clean
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewDetail;
