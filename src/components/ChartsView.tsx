import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '@/components/ui/icon';

interface HealthRecord {
  id: string;
  date: string;
  type: 'bmi' | 'calories' | 'pressure' | 'sugar' | 'cholesterol';
  value: number | string;
  additionalData?: any;
}

interface ChartsViewProps {
  history: HealthRecord[];
}

export const ChartsView = ({ history }: ChartsViewProps) => {
  const getChartData = (type: string) => {
    const filtered = history
      .filter(record => record.type === type)
      .slice(0, 10)
      .reverse();
    
    return filtered.map(record => ({
      date: new Date(record.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
      value: typeof record.value === 'number' ? record.value : parseFloat(record.value as string) || 0,
    }));
  };

  const bmiData = getChartData('bmi');
  const caloriesData = getChartData('calories');
  const sugarData = getChartData('sugar');
  const cholesterolData = getChartData('cholesterol');

  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-bold text-gray-900 mb-8 font-heading">
        Графики динамики показателей
      </h2>

      <div className="grid gap-6">
        {bmiData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Icon name="Scale" className="text-primary" size={24} />
                Динамика ИМТ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bmiData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={2} name="ИМТ" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {caloriesData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Icon name="Flame" className="text-secondary" size={24} />
                Динамика калорий
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={caloriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} name="Калории" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {sugarData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Icon name="Droplet" className="text-yellow-500" size={24} />
                Динамика сахара в крови
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sugarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#EAB308" strokeWidth={2} name="Глюкоза (ммоль/л)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {cholesterolData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Icon name="TrendingUp" className="text-purple-500" size={24} />
                Динамика холестерина
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cholesterolData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#A855F7" strokeWidth={2} name="Холестерин (ммоль/л)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {history.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="LineChart" className="mx-auto text-gray-400 mb-4" size={64} />
              <p className="text-xl text-gray-600">Графики пока недоступны</p>
              <p className="text-sm text-gray-400 mt-2">Сделайте несколько расчётов, чтобы увидеть динамику показателей</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
