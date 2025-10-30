import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface CaloriesCalculatorProps {
  onSave: (data: { type: 'calories'; value: number; additionalData?: any }) => void;
}

export const CaloriesCalculator = ({ onSave }: CaloriesCalculatorProps) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState<number | null>(null);

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    
    if (w > 0 && h > 0 && a > 0) {
      let bmr;
      if (gender === 'male') {
        bmr = 10 * w + 6.25 * h - 5 * a + 5;
      } else {
        bmr = 10 * w + 6.25 * h - 5 * a - 161;
      }
      const roundedBMR = Math.round(bmr);
      setResult(roundedBMR);
      onSave({ type: 'calories', value: roundedBMR, additionalData: { gender, age: a } });
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-secondary">
      <CardHeader>
        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="Flame" className="text-secondary" size={24} />
        </div>
        <CardTitle className="font-heading text-2xl">Калькулятор калорий</CardTitle>
        <CardDescription>Суточная норма калорий</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cal-weight">Вес (кг)</Label>
          <Input
            id="cal-weight"
            type="number"
            placeholder="70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cal-height">Рост (см)</Label>
          <Input
            id="cal-height"
            type="number"
            placeholder="170"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cal-age">Возраст (лет)</Label>
          <Input
            id="cal-age"
            type="number"
            placeholder="30"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1"
          />
        </div>
        <Tabs value={gender} onValueChange={setGender} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="male">Мужчина</TabsTrigger>
            <TabsTrigger value="female">Женщина</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={calculateCalories} className="w-full" size="lg">
          <Icon name="Calculator" size={18} className="mr-2" />
          Рассчитать
        </Button>
        
        {result !== null && (
          <div className="mt-4 p-4 bg-secondary/5 rounded-lg animate-fade-in">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600 mb-1">Базовый метаболизм</p>
              <p className="text-4xl font-bold text-secondary font-heading">{result}</p>
              <p className="text-sm text-gray-600 mt-1">ккал/день</p>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Icon name="Armchair" size={14} />
                  Низкая активность
                </span>
                <span className="font-semibold">{Math.round(result * 1.2)} ккал</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Icon name="PersonStanding" size={14} />
                  Средняя активность
                </span>
                <span className="font-semibold">{Math.round(result * 1.55)} ккал</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Icon name="Dumbbell" size={14} />
                  Высокая активность
                </span>
                <span className="font-semibold">{Math.round(result * 1.9)} ккал</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
