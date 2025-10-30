import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export const DosageCalculator = () => {
  const [weight, setWeight] = useState('');
  const [drug, setDrug] = useState('');
  const [result, setResult] = useState<string>('');

  const calculateDosage = () => {
    const w = parseFloat(weight);
    if (w > 0 && drug) {
      const dosages: { [key: string]: string } = {
        'парацетамол': `${Math.round(w * 10)} мг (10-15 мг/кг каждые 4-6 часов)`,
        'ибупрофен': `${Math.round(w * 7)} мг (5-10 мг/кг каждые 6-8 часов)`,
        'амоксициллин': `${Math.round(w * 25)} мг (20-40 мг/кг в сутки)`,
      };
      setResult(dosages[drug.toLowerCase()] || 'Препарат не найден в базе');
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-accent">
      <CardHeader>
        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="Pill" className="text-accent" size={24} />
        </div>
        <CardTitle className="font-heading text-2xl">Дозировка лекарств</CardTitle>
        <CardDescription>Расчёт детской дозы</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="dos-weight">Вес ребёнка (кг)</Label>
          <Input
            id="dos-weight"
            type="number"
            placeholder="20"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="dos-drug">Название препарата</Label>
          <Input
            id="dos-drug"
            type="text"
            placeholder="Парацетамол"
            value={drug}
            onChange={(e) => setDrug(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <p className="font-semibold mb-1">Доступные препараты:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Парацетамол</li>
            <li>Ибупрофен</li>
            <li>Амоксициллин</li>
          </ul>
        </div>
        <Button onClick={calculateDosage} className="w-full" size="lg">
          <Icon name="Calculator" size={18} className="mr-2" />
          Рассчитать
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-accent/5 rounded-lg animate-fade-in">
            <div className="flex items-start gap-2">
              <Icon name="AlertCircle" className="text-accent mt-1" size={20} />
              <div>
                <p className="font-semibold text-accent mb-2">Рекомендуемая дозировка:</p>
                <p className="text-sm">{result}</p>
                <p className="text-xs text-gray-500 mt-3 italic">
                  ⚠️ Перед применением обязательно проконсультируйтесь с врачом
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
