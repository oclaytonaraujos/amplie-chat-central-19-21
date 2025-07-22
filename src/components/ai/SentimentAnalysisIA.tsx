import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  Frown,
  Meh,
  Smile,
  Activity,
  MessageCircle,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SentimentData {
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  emotion: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  keywords: string[];
  suggestion?: string;
}

interface MessageAnalysis {
  id: string;
  message: string;
  timestamp: string;
  sentiment: SentimentData;
  customer: string;
  channel: string;
}

const mockAnalyses: MessageAnalysis[] = [
  {
    id: '1',
    message: 'Estou muito insatisfeito com o atendimento. Já é a terceira vez que entro em contato e ninguém resolve meu problema!',
    timestamp: '2024-01-07 14:30',
    sentiment: {
      score: -0.8,
      confidence: 0.92,
      emotion: 'very_negative',
      keywords: ['insatisfeito', 'terceira vez', 'ninguém resolve'],
      suggestion: 'Cliente extremamente insatisfeito. Escalar para supervisor imediatamente.'
    },
    customer: 'João Silva',
    channel: 'WhatsApp'
  },
  {
    id: '2',
    message: 'Obrigado pelo excelente atendimento! Vocês são incríveis, problema resolvido rapidamente.',
    timestamp: '2024-01-07 14:25',
    sentiment: {
      score: 0.9,
      confidence: 0.95,
      emotion: 'very_positive',
      keywords: ['obrigado', 'excelente', 'incríveis', 'rapidamente'],
      suggestion: 'Cliente muito satisfeito. Considere solicitar feedback público.'
    },
    customer: 'Maria Santos',
    channel: 'Chat'
  },
  {
    id: '3',
    message: 'Gostaria de saber sobre os preços dos planos disponíveis.',
    timestamp: '2024-01-07 14:20',
    sentiment: {
      score: 0.1,
      confidence: 0.65,
      emotion: 'neutral',
      keywords: ['gostaria', 'preços', 'planos'],
      suggestion: 'Cliente interessado em comprar. Apresente opções de forma clara.'
    },
    customer: 'Pedro Costa',
    channel: 'Email'
  }
];

export function SentimentAnalysisIA() {
  const [analyses, setAnalyses] = useState<MessageAnalysis[]>(mockAnalyses);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAnalyzed: 1247,
    positive: 58.3,
    negative: 12.7,
    neutral: 29.0,
    avgSentiment: 0.34,
    alertsGenerated: 23
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const getSentimentIcon = (emotion: string) => {
    switch (emotion) {
      case 'very_positive': return <Smile className="h-5 w-5 text-green-600" />;
      case 'positive': return <Smile className="h-5 w-5 text-green-400" />;
      case 'neutral': return <Meh className="h-5 w-5 text-gray-400" />;
      case 'negative': return <Frown className="h-5 w-5 text-orange-400" />;
      case 'very_negative': return <Frown className="h-5 w-5 text-red-600" />;
      default: return <Meh className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.5) return 'text-green-600 bg-green-50';
    if (score > 0) return 'text-green-400 bg-green-50';
    if (score > -0.5) return 'text-orange-400 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getSentimentText = (emotion: string) => {
    switch (emotion) {
      case 'very_positive': return 'Muito Positivo';
      case 'positive': return 'Positivo';
      case 'neutral': return 'Neutro';
      case 'negative': return 'Negativo';
      case 'very_negative': return 'Muito Negativo';
      default: return 'Indefinido';
    }
  };

  const loadRealAnalyses = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Buscar empresa do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      // Buscar análises de sentimento reais
      const { data: sentimentData, error } = await supabase
        .from('sentiment_analysis')
        .select(`
          *,
          mensagens(
            conteudo,
            remetente_nome,
            created_at,
            conversas(canal, contatos(nome))
          )
        `)
        .eq('empresa_id', profile.empresa_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      // Converter para formato do componente
      const realAnalyses: MessageAnalysis[] = sentimentData?.map(item => ({
        id: item.id,
        message: item.mensagens?.conteudo || 'Mensagem não encontrada',
        timestamp: new Date(item.created_at).toLocaleString('pt-BR'),
        sentiment: {
          score: item.sentimento_score,
          confidence: item.sentimento_confianca,
          emotion: item.emocao as any,
          keywords: item.palavras_chave || [],
          suggestion: item.sugestao_ia
        },
        customer: item.mensagens?.remetente_nome || item.mensagens?.conversas?.contatos?.nome || 'Cliente',
        channel: item.mensagens?.conversas?.canal || 'WhatsApp'
      })) || [];

      setAnalyses(realAnalyses);

      // Calcular estatísticas reais
      if (sentimentData && sentimentData.length > 0) {
        const total = sentimentData.length;
        const positive = sentimentData.filter(s => s.sentimento_score > 0.2).length;
        const negative = sentimentData.filter(s => s.sentimento_score < -0.2).length;
        const neutral = total - positive - negative;
        const avgSentiment = sentimentData.reduce((acc, s) => acc + s.sentimento_score, 0) / total;
        const alerts = sentimentData.filter(s => s.sentimento_score < -0.5).length;

        setStats({
          totalAnalyzed: total,
          positive: Math.round((positive / total) * 100),
          negative: Math.round((negative / total) * 100),
          neutral: Math.round((neutral / total) * 100),
          avgSentiment: Number(avgSentiment.toFixed(2)),
          alertsGenerated: alerts
        });
      }

      toast({
        title: "Dados carregados",
        description: "Análises de sentimento atualizadas com dados reais",
      });

    } catch (error) {
      console.error('Erro ao carregar análises:', error);
      toast({
        title: "Erro ao carregar",
        description: "Usando dados simulados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeNewMessage = async () => {
    if (!user) return;

    setIsAnalyzing(true);
    try {
      // Buscar empresa do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      // Simular uma mensagem para análise
      const testMessage = 'Este produto é uma decepção total. Não recomendo para ninguém.';

      // Chamar edge function para análise
      const { data: result, error } = await supabase.functions.invoke('sentiment-analysis', {
        body: {
          message: testMessage,
          empresaId: profile.empresa_id
        }
      });

      if (error) {
        throw error;
      }

      const newAnalysis: MessageAnalysis = {
        id: Date.now().toString(),
        message: testMessage,
        timestamp: new Date().toLocaleString('pt-BR'),
        sentiment: result,
        customer: 'Teste IA',
        channel: 'WhatsApp'
      };

      setAnalyses(prev => [newAnalysis, ...prev.slice(0, 9)]);

      toast({
        title: "Análise Concluída",
        description: `Sentimento detectado: ${result.emotion}`,
        variant: result.score < -0.5 ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: "Erro na análise",
        description: "Verifique se a chave da OpenAI está configurada",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    loadRealAnalyses();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Análise de Sentimento com IA
          </h2>
          <p className="text-muted-foreground">
            Detecção automática de humor e satisfação do cliente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadRealAnalyses} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={analyzeNewMessage} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Testar IA
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Analisado</p>
                <p className="text-2xl font-bold">{stats.totalAnalyzed}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positivos</p>
                <p className="text-2xl font-bold text-green-600">{stats.positive}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Negativos</p>
                <p className="text-2xl font-bold text-red-600">{stats.negative}%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas</p>
                <p className="text-2xl font-bold text-orange-600">{stats.alertsGenerated}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Sentimentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição de Sentimentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Smile className="h-4 w-4 text-green-600" />
                Positivos
              </span>
              <span className="font-medium">{stats.positive}%</span>
            </div>
            <Progress value={stats.positive} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Meh className="h-4 w-4 text-gray-400" />
                Neutros
              </span>
              <span className="font-medium">{stats.neutral}%</span>
            </div>
            <Progress value={stats.neutral} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Frown className="h-4 w-4 text-red-600" />
                Negativos
              </span>
              <span className="font-medium">{stats.negative}%</span>
            </div>
            <Progress value={stats.negative} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Análises Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Análises Recentes</CardTitle>
          <CardDescription>
            Mensagens analisadas automaticamente pela IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div 
                key={analysis.id} 
                className={`p-4 rounded-lg border ${
                  analysis.sentiment.emotion === 'very_negative' ? 'border-red-200 bg-red-50' :
                  analysis.sentiment.emotion === 'negative' ? 'border-orange-200 bg-orange-50' :
                  analysis.sentiment.emotion === 'very_positive' ? 'border-green-200 bg-green-50' :
                  'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getSentimentIcon(analysis.sentiment.emotion)}
                    <div>
                      <h4 className="font-medium">{analysis.customer}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{analysis.channel}</span>
                        <span>•</span>
                        <span>{analysis.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSentimentColor(analysis.sentiment.score)}>
                      {getSentimentText(analysis.sentiment.emotion)}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(analysis.sentiment.confidence * 100)}% confiança
                    </Badge>
                  </div>
                </div>

                <blockquote className="italic text-sm mb-3 pl-4 border-l-2 border-gray-300">
                  "{analysis.message}"
                </blockquote>

                {analysis.sentiment.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="text-xs text-muted-foreground mr-2">Palavras-chave:</span>
                    {analysis.sentiment.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}

                {analysis.sentiment.suggestion && (
                  <Alert className="mt-3">
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Sugestão da IA:</strong> {analysis.sentiment.suggestion}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da IA</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              A análise de sentimento utiliza processamento de linguagem natural avançado 
              para detectar emoções e gerar sugestões automáticas de resposta.
              <br />
              <strong>Modelo atual:</strong> GPT-4.1-2025-04-14 para análise de texto em português
              <br />
              <strong>Funcionalidades:</strong> Detecção de humor, palavras-chave e alertas automáticos
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}