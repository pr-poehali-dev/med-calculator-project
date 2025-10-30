import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PressureCalculatorProps {
  onSave: (data: { type: 'pressure'; value: string; additionalData?: any }) => void;
}

export const PressureCalculator = ({ onSave }: PressureCalculatorProps) => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [result, setResult] = useState<string>('');

  const calculatePressure = () => {
    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);
    
    if (sys > 0 && dia > 0) {
      let res = '';
      if (sys < 120 && dia < 80) {
        res = 'Нормальное давление';
      } else if (sys < 130 && dia < 80) {
        res = 'Повышенное давление';
      } else if (sys < 140 || dia < 90) {
        res = 'Гипертония 1 степени';
      } else if (sys < 180 || dia < 120) {
        res = 'Гипертония 2 степени';
      } else {
        res = 'Гипертонический криз';
      }
      setResult(res);
      onSave({ type: 'pressure', value: `${sys}/${dia}`, additionalData: { systolic: sys, diastolic: dia, result: res } });
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-red-500">
      <CardHeader>
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="Heart" className="text-red-500" size={24} />
        </div>
        <CardTitle className="font-heading text-2xl">Артериальное давление</CardTitle>
        <CardDescription>Оценка показателей давления</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="pressure-sys">Систолическое (мм рт.ст.)</Label>
          <Input
            id="pressure-sys"
            type="number"
            placeholder="120"
            value={systolic}
            onChange={(e) => setSystolic(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="pressure-dia">Диастолическое (мм рт.ст.)</Label>
          <Input
            id="pressure-dia"
            type="number"
            placeholder="80"
            value={diastolic}
            onChange={(e) => setDiastolic(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={calculatePressure} className="w-full" size="lg">
          <Icon name="Calculator" size={18} className="mr-2" />
          Рассчитать
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-red-500/5 rounded-lg animate-fade-in">
            <div className="text-center mb-3">
              <p className="text-3xl font-bold text-red-500 font-heading">
                {systolic}/{diastolic}
              </p>
              <Badge className="mt-2 bg-red-500">
                {result}
              </Badge>
            </div>
            <div className="text-xs text-gray-500 mt-3">
              <p>✓ Норма: &lt;120/80</p>
              <p>⚠ Повышенное: 120-129/&lt;80</p>
              <p>⚠ Гипертония 1: 130-139 или 80-89</p>
              <p>🚨 Гипертония 2: ≥140 или ≥90</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
