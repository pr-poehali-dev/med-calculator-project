import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface SugarCalculatorProps {
  onSave: (data: { type: 'sugar'; value: number; additionalData?: any }) => void;
}

export const SugarCalculator = ({ onSave }: SugarCalculatorProps) => {
  const [level, setLevel] = useState('');
  const [mealTime, setMealTime] = useState('fasting');
  const [result, setResult] = useState<string>('');

  const calculateSugar = () => {
    const sugar = parseFloat(level);
    
    if (sugar > 0) {
      let res = '';
      if (mealTime === 'fasting') {
        if (sugar < 5.6) res = 'Норма';
        else if (sugar < 7.0) res = 'Преддиабет';
        else res = 'Диабет';
      } else {
        if (sugar < 7.8) res = 'Норма';
        else if (sugar < 11.1) res = 'Преддиабет';
        else res = 'Диабет';
      }
      setResult(res);
      onSave({ type: 'sugar', value: sugar, additionalData: { mealTime, result: res } });
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-yellow-500">
      <CardHeader>
        <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="Droplet" className="text-yellow-500" size={24} />
        </div>
        <CardTitle className="font-heading text-2xl">Уровень сахара</CardTitle>
        <CardDescription>Контроль глюкозы в крови</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="sugar-level">Уровень глюкозы (ммоль/л)</Label>
          <Input
            id="sugar-level"
            type="number"
            step="0.1"
            placeholder="5.5"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="mt-1"
          />
        </div>
        <Tabs value={mealTime} onValueChange={setMealTime} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fasting">Натощак</TabsTrigger>
            <TabsTrigger value="after_meal">После еды</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={calculateSugar} className="w-full" size="lg">
          <Icon name="Calculator" size={18} className="mr-2" />
          Рассчитать
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-yellow-500/5 rounded-lg animate-fade-in">
            <div className="text-center mb-3">
              <p className="text-3xl font-bold text-yellow-600 font-heading">
                {level} ммоль/л
              </p>
              <Badge className="mt-2 bg-yellow-500">
                {result}
              </Badge>
            </div>
            <div className="text-xs text-gray-500 mt-3">
              {mealTime === 'fasting' ? (
                <>
                  <p>✓ Норма натощак: &lt;5.6</p>
                  <p>⚠ Преддиабет: 5.6-6.9</p>
                  <p>🚨 Диабет: ≥7.0</p>
                </>
              ) : (
                <>
                  <p>✓ Норма после еды: &lt;7.8</p>
                  <p>⚠ Преддиабет: 7.8-11.0</p>
                  <p>🚨 Диабет: ≥11.1</p>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
