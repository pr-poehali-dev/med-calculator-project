import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface BMICalculatorProps {
  onSave: (data: { type: 'bmi'; value: number; additionalData?: any }) => void;
}

export const BMICalculator = ({ onSave }: BMICalculatorProps) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculateBMI = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmi = w / (h * h);
      const roundedBMI = Math.round(bmi * 10) / 10;
      setResult(roundedBMI);
      onSave({ type: 'bmi', value: roundedBMI, additionalData: { height, weight } });
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Недостаточный вес', color: 'bg-blue-500' };
    if (bmi < 25) return { text: 'Нормальный вес', color: 'bg-accent' };
    if (bmi < 30) return { text: 'Избыточный вес', color: 'bg-orange-500' };
    return { text: 'Ожирение', color: 'bg-destructive' };
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-primary">
      <CardHeader>
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="Scale" className="text-primary" size={24} />
        </div>
        <CardTitle className="font-heading text-2xl">Калькулятор ИМТ</CardTitle>
        <CardDescription>Индекс массы тела</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="bmi-height">Рост (см)</Label>
          <Input
            id="bmi-height"
            type="number"
            placeholder="170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="bmi-weight">Вес (кг)</Label>
          <Input
            id="bmi-weight"
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={calculateBMI} className="w-full" size="lg">
          <Icon name="Calculator" size={18} className="mr-2" />
          Рассчитать
        </Button>
        
        {result !== null && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg animate-fade-in">
            <div className="text-center mb-3">
              <p className="text-4xl font-bold text-primary font-heading">{result}</p>
              <Badge className={`mt-2 ${getBMICategory(result).color}`}>
                {getBMICategory(result).text}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Недостаточный</span>
                <span className="text-gray-500">&lt; 18.5</span>
              </div>
              <Progress value={result < 18.5 ? 100 : 0} className="h-2" />
              <div className="flex justify-between">
                <span>Норма</span>
                <span className="text-gray-500">18.5 - 24.9</span>
              </div>
              <Progress 
                value={result >= 18.5 && result < 25 ? 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between">
                <span>Избыточный</span>
                <span className="text-gray-500">25 - 29.9</span>
              </div>
              <Progress 
                value={result >= 25 && result < 30 ? 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between">
                <span>Ожирение</span>
                <span className="text-gray-500">&gt; 30</span>
              </div>
              <Progress 
                value={result >= 30 ? 100 : 0} 
                className="h-2"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
