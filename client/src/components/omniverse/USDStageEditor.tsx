import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download, 
  Upload, 
  Eye, 
  Code2,
  Database,
  Settings
} from 'lucide-react';
import { convertToUSD, exportUSDString, USDStage } from '@shared/usd-schema';

interface USDStageEditorProps {
  model: any | null;
  className?: string;
}

const USDStageEditor: React.FC<USDStageEditorProps> = ({ model, className = "" }) => {
  const [usdStage, setUsdStage] = useState<USDStage | null>(null);
  const [usdContent, setUsdContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (model) {
      try {
        const stage = convertToUSD(model);
        setUsdStage(stage);
        const content = exportUSDString(stage);
        setUsdContent(content);
      } catch (error) {
        console.error('Error converting to USD:', error);
      }
    }
  }, [model]);

  const handleDownloadUSD = () => {
    if (!usdContent) return;
    
    const blob = new Blob([usdContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model?.name || 'model'}.usda`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPrimIcon = (primType: string) => {
    switch (primType) {
      case 'Mesh': return <Database className="w-3 h-3" />;
      case 'Material': return <Settings className="w-3 h-3" />;
      case 'Xform': return <Code2 className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  if (!model) {
    return (
      <div className={`${className} flex items-center justify-center h-96 bg-gray-800 rounded-lg border border-gray-600`}>
        <div className="text-center text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No model loaded for USD conversion</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">USD Stage Editor</h3>
          <p className="text-sm text-gray-400">Universal Scene Description export and editing</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="border-gray-500"
          >
            <Eye className="w-4 h-4 mr-1" />
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadUSD}
            disabled={!usdContent}
            className="border-gray-500"
          >
            <Download className="w-4 h-4 mr-1" />
            Export USD
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stage Hierarchy */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base">Stage Hierarchy</CardTitle>
            {usdStage && (
              <div className="flex gap-2">
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  {usdStage.name}
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  {usdStage.prims.length} prims
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {usdStage && (
                <div className="space-y-1">
                  {usdStage.prims.map((prim, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-600 cursor-pointer">
                        {getPrimIcon(prim.type)}
                        <span className="text-white text-sm">{prim.path}</span>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {prim.type}
                        </Badge>
                      </div>
                      {prim.children.map((child, childIndex) => (
                        <div key={childIndex} className="ml-4 flex items-center gap-2 p-2 rounded hover:bg-gray-600 cursor-pointer">
                          {getPrimIcon(child.type)}
                          <span className="text-gray-300 text-sm">{child.path}</span>
                          <Badge variant="outline" className="text-xs ml-auto">
                            {child.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* USD Content */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base">USD Content</CardTitle>
            <Badge variant="outline" className="border-purple-500 text-purple-400 w-fit">
              .usda format
            </Badge>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={usdContent}
                onChange={(e) => setUsdContent(e.target.value)}
                className="h-64 bg-gray-800 border-gray-500 text-white font-mono text-xs"
                placeholder="USD content will appear here..."
              />
            ) : (
              <ScrollArea className="h-64">
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
                  {usdContent}
                </pre>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stage Properties */}
      {usdStage && (
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base">Stage Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Default Prim:</span>
                <p className="text-white font-mono">{usdStage.defaultPrim}</p>
              </div>
              <div>
                <span className="text-gray-400">Time Codes/Sec:</span>
                <p className="text-white">{usdStage.timeCodesPerSecond}</p>
              </div>
              <div>
                <span className="text-gray-400">Start Time:</span>
                <p className="text-white">{usdStage.startTimeCode}</p>
              </div>
              <div>
                <span className="text-gray-400">End Time:</span>
                <p className="text-white">{usdStage.endTimeCode}</p>
              </div>
            </div>
            {usdStage.metadata && (
              <div className="mt-4">
                <span className="text-gray-400 text-sm">Metadata:</span>
                <div className="mt-1 p-2 bg-gray-800 rounded text-xs">
                  <pre className="text-gray-300">{JSON.stringify(usdStage.metadata, null, 2)}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default USDStageEditor;