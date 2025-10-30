import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CholesterolCalculatorProps {
  onSave: (data: { type: 'cholesterol'; value: number; additionalData?: any }) => void;
}

export const CholesterolCalculator = ({ onSave }: CholesterolCalculatorProps) => {
  const [total, setTotal] = useState('');
  const [ldl, setLdl] = useState('');
  const [hdl, setHdl] = useState('');
  const [result, setResult] = useState<string>('');

  const calculateCholesterol = () => {
    const totalVal = parseFloat(total);
    const ldlVal = parseFloat(ldl);
    const hdlVal = parseFloat(hdl);
    
    if (totalVal > 0) {
      let res = '';
      if (totalVal < 5.2) res = 'Оптимальный уровень';
      else if (totalVal < 6.2) res = 'Погранично высокий';
      else res = 'Высокий уровень';
      
      if (ldlVal > 0) {
        if (ldlVal < 2.6) res += ', ЛПНП в норме';
        else if (ldlVal < 3.4) res += ', ЛПНП погранично';
        else res += ', ЛПНП высокий';
      }
      
      if (hdlVal > 0) {
        if (hdlVal >= 1.6) res += ', ЛПВП отличный';
        else if (hdlVal >= 1.0) res += ', ЛПВП в норме';
        else res += ', ЛПВП низкий';
      }
      
      setResult(res);
      onSave({ type: 'cholesterol', value: totalVal, additionalData: { ldl: ldlVal, hdl: hdlVal, result: res } });
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 animate-scale-in border-2 hover:border-purple-500">
      <CardHeader>
        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3">
          <Icon name="TrendingUp" className="text-purple-500" size={24} />
        </div>
        <CardTitle className="font-heading text-2xl">Холестерин</CardTitle>
        <CardDescription>Липидный профиль крови</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="chol-total">Общий холестерин (ммоль/л)</Label>
          <Input
            id="chol-total"
            type="number"
            step="0.1"
            placeholder="5.0"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="chol-ldl">ЛПНП (плохой)</Label>
          <Input
            id="chol-ldl"
            type="number"
            step="0.1"
            placeholder="3.0"
            value={ldl}
            onChange={(e) => setLdl(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="chol-hdl">ЛПВП (хороший)</Label>
          <Input
            id="chol-hdl"
            type="number"
            step="0.1"
            placeholder="1.5"
            value={hdl}
            onChange={(e) => setHdl(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={calculateCholesterol} className="w-full" size="lg">
          <Icon name="Calculator" size={18} className="mr-2" />
          Рассчитать
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-purple-500/5 rounded-lg animate-fade-in">
            <div className="text-center mb-3">
              <p className="text-3xl font-bold text-purple-500 font-heading">
                {total} ммоль/л
              </p>
              <p className="text-xs mt-2 text-gray-600">{result}</p>
            </div>
            <div className="text-xs text-gray-500 mt-3">
              <p>✓ Оптимальный: &lt;5.2</p>
              <p>⚠ Погранично: 5.2-6.2</p>
              <p>🚨 Высокий: ≥6.2</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
