import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '@/components/ui/icon';

interface HealthRecord {
  id: string;
  date: string;
  type: 'bmi' | 'calories' | 'pressure' | 'sugar' | 'cholesterol';
  value: number | string;
  additionalData?: any;
}

const Index = () => {
  const [history, setHistory] = useState<HealthRecord[]>([]);
  const [activeTab, setActiveTab] = useState('calculators');

  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  const [caloriesWeight, setCaloriesWeight] = useState('');
  const [caloriesHeight, setCaloriesHeight] = useState('');
  const [caloriesAge, setCaloriesAge] = useState('');
  const [caloriesGender, setCaloriesGender] = useState('male');
  const [caloriesResult, setCaloriesResult] = useState<number | null>(null);

  const [dosageWeight, setDosageWeight] = useState('');
  const [dosageDrug, setDosageDrug] = useState('');
  const [dosageResult, setDosageResult] = useState<string>('');

  const [pressureSystolic, setPressureSystolic] = useState('');
  const [pressureDiastolic, setPressureDiastolic] = useState('');
  const [pressureResult, setPressureResult] = useState<string>('');

  const [sugarLevel, setSugarLevel] = useState('');
  const [sugarMealTime, setSugarMealTime] = useState('fasting');
  const [sugarResult, setSugarResult] = useState<string>('');

  const [cholesterolTotal, setCholesterolTotal] = useState('');
  const [cholesterolLDL, setCholesterolLDL] = useState('');
  const [cholesterolHDL, setCholesterolHDL] = useState('');
  const [cholesterolResult, setCholesterolResult] = useState<string>('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('healthHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (record: Omit<HealthRecord, 'id' | 'date'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updatedHistory = [newRecord, ...history].slice(0, 100);
    setHistory(updatedHistory);
    localStorage.setItem('healthHistory', JSON.stringify(updatedHistory));
  };

  const calculateBMI = () => {
    const height = parseFloat(bmiHeight) / 100;
    const weight = parseFloat(bmiWeight);
    if (height > 0 && weight > 0) {
      const bmi = weight / (height * height);
      const roundedBMI = Math.round(bmi * 10) / 10;
      setBmiResult(roundedBMI);
      saveToHistory({ type: 'bmi', value: roundedBMI, additionalData: { height: bmiHeight, weight: bmiWeight } });
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Недостаточный вес', color: 'bg-blue-500' };
    if (bmi < 25) return { text: 'Нормальный вес', color: 'bg-accent' };
    if (bmi < 30) return { text: 'Избыточный вес', color: 'bg-orange-500' };
    return { text: 'Ожирение', color: 'bg-destructive' };
  };

  const calculateCalories = () => {
    const weight = parseFloat(caloriesWeight);
    const height = parseFloat(caloriesHeight);
    const age = parseFloat(caloriesAge);
    
    if (weight > 0 && height > 0 && age > 0) {
      let bmr;
      if (caloriesGender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      const roundedBMR = Math.round(bmr);
      setCaloriesResult(roundedBMR);
      saveToHistory({ type: 'calories', value: roundedBMR, additionalData: { gender: caloriesGender, age } });
    }
  };

  const calculateDosage = () => {
    const weight = parseFloat(dosageWeight);
    if (weight > 0 && dosageDrug) {
      const dosages: { [key: string]: string } = {
        'парацетамол': `${Math.round(weight * 10)} мг (10-15 мг/кг каждые 4-6 часов)`,
        'ибупрофен': `${Math.round(weight * 7)} мг (5-10 мг/кг каждые 6-8 часов)`,
        'амоксициллин': `${Math.round(weight * 25)} мг (20-40 мг/кг в сутки)`,
      };
      setDosageResult(dosages[dosageDrug.toLowerCase()] || 'Препарат не найден в базе');
    }
  };

  const calculatePressure = () => {
    const systolic = parseFloat(pressureSystolic);
    const diastolic = parseFloat(pressureDiastolic);
    
    if (systolic > 0 && diastolic > 0) {
      let result = '';
      if (systolic < 120 && diastolic < 80) {
        result = 'Нормальное давление';
      } else if (systolic < 130 && diastolic < 80) {
        result = 'Повышенное давление';
      } else if (systolic < 140 || diastolic < 90) {
        result = 'Гипертония 1 степени';
      } else if (systolic < 180 || diastolic < 120) {
        result = 'Гипертония 2 степени';
      } else {
        result = 'Гипертонический криз';
      }
      setPressureResult(result);
      saveToHistory({ type: 'pressure', value: `${systolic}/${diastolic}`, additionalData: { systolic, diastolic, result } });
    }
  };

  const calculateSugar = () => {
    const sugar = parseFloat(sugarLevel);
    
    if (sugar > 0) {
      let result = '';
      if (sugarMealTime === 'fasting') {
        if (sugar < 5.6) result = 'Норма';
        else if (sugar < 7.0) result = 'Преддиабет';
        else result = 'Диабет';
      } else {
        if (sugar < 7.8) result = 'Норма';
        else if (sugar < 11.1) result = 'Преддиабет';
        else result = 'Диабет';
      }
      setSugarResult(result);
      saveToHistory({ type: 'sugar', value: sugar, additionalData: { mealTime: sugarMealTime, result } });
    }
  };

  const calculateCholesterol = () => {
    const total = parseFloat(cholesterolTotal);
    const ldl = parseFloat(cholesterolLDL);
    const hdl = parseFloat(cholesterolHDL);
    
    if (total > 0) {
      let result = '';
      if (total < 5.2) result = 'Оптимальный уровень';
      else if (total < 6.2) result = 'Погранично высокий';
      else result = 'Высокий уровень';
      
      if (ldl > 0) {
        if (ldl < 2.6) result += ', ЛПНП в норме';
        else if (ldl < 3.4) result += ', ЛПНП погранично';
        else result += ', ЛПНП высокий';
      }
      
      if (hdl > 0) {
        if (hdl >= 1.6) result += ', ЛПВП отличный';
        else if (hdl >= 1.0) result += ', ЛПВП в норме';
        else result += ', ЛПВП низкий';
      }
      
      setCholesterolResult(result);
      saveToHistory({ type: 'cholesterol', value: total, additionalData: { ldl, hdl, result } });
    }
  };

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

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('healthHistory');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Activity" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold text-primary font-heading">МедКалькулятор</h1>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setActiveTab('calculators')} className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="Calculator" size={20} />
                Калькуляторы
              </button>
              <button onClick={() => setActiveTab('history')} className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="History" size={20} />
                История
              </button>
              <button onClick={() => setActiveTab('charts')} className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="LineChart" size={20} />
                Графики
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'calculators' && (
          <>
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-5xl font-bold text-gray-900 mb-4 font-heading">
                Медицинские калькуляторы
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Быстрые и точные расчёты для здоровья и медицинских назначений
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
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
                      value={bmiHeight}
                      onChange={(e) => setBmiHeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bmi-weight">Вес (кг)</Label>
                    <Input
                      id="bmi-weight"
                      type="number"
                      placeholder="70"
                      value={bmiWeight}
                      onChange={(e) => setBmiWeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={calculateBMI} className="w-full" size="lg">
                    <Icon name="Calculator" size={18} className="mr-2" />
                    Рассчитать
                  </Button>
                  
                  {bmiResult !== null && (
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg animate-fade-in">
                      <div className="text-center mb-3">
                        <p className="text-4xl font-bold text-primary font-heading">{bmiResult}</p>
                        <Badge className={`mt-2 ${getBMICategory(bmiResult).color}`}>
                          {getBMICategory(bmiResult).text}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Недостаточный</span>
                          <span className="text-gray-500">&lt; 18.5</span>
                        </div>
                        <Progress value={bmiResult < 18.5 ? 100 : 0} className="h-2" />
                        <div className="flex justify-between">
                          <span>Норма</span>
                          <span className="text-gray-500">18.5 - 24.9</span>
                        </div>
                        <Progress 
                          value={bmiResult >= 18.5 && bmiResult < 25 ? 100 : 0} 
                          className="h-2"
                        />
                        <div className="flex justify-between">
                          <span>Избыточный</span>
                          <span className="text-gray-500">25 - 29.9</span>
                        </div>
                        <Progress 
                          value={bmiResult >= 25 && bmiResult < 30 ? 100 : 0} 
                          className="h-2"
                        />
                        <div className="flex justify-between">
                          <span>Ожирение</span>
                          <span className="text-gray-500">&gt; 30</span>
                        </div>
                        <Progress 
                          value={bmiResult >= 30 ? 100 : 0} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                      value={caloriesWeight}
                      onChange={(e) => setCaloriesWeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cal-height">Рост (см)</Label>
                    <Input
                      id="cal-height"
                      type="number"
                      placeholder="170"
                      value={caloriesHeight}
                      onChange={(e) => setCaloriesHeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cal-age">Возраст (лет)</Label>
                    <Input
                      id="cal-age"
                      type="number"
                      placeholder="30"
                      value={caloriesAge}
                      onChange={(e) => setCaloriesAge(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Tabs value={caloriesGender} onValueChange={setCaloriesGender} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="male">Мужчина</TabsTrigger>
                      <TabsTrigger value="female">Женщина</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button onClick={calculateCalories} className="w-full" size="lg">
                    <Icon name="Calculator" size={18} className="mr-2" />
                    Рассчитать
                  </Button>
                  
                  {caloriesResult !== null && (
                    <div className="mt-4 p-4 bg-secondary/5 rounded-lg animate-fade-in">
                      <div className="text-center mb-3">
                        <p className="text-sm text-gray-600 mb-1">Базовый метаболизм</p>
                        <p className="text-4xl font-bold text-secondary font-heading">{caloriesResult}</p>
                        <p className="text-sm text-gray-600 mt-1">ккал/день</p>
                      </div>
                      <div className="space-y-2 mt-4">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Icon name="Armchair" size={14} />
                            Низкая активность
                          </span>
                          <span className="font-semibold">{Math.round(caloriesResult * 1.2)} ккал</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Icon name="PersonStanding" size={14} />
                            Средняя активность
                          </span>
                          <span className="font-semibold">{Math.round(caloriesResult * 1.55)} ккал</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Icon name="Dumbbell" size={14} />
                            Высокая активность
                          </span>
                          <span className="font-semibold">{Math.round(caloriesResult * 1.9)} ккал</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                      value={dosageWeight}
                      onChange={(e) => setDosageWeight(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dos-drug">Название препарата</Label>
                    <Input
                      id="dos-drug"
                      type="text"
                      placeholder="Парацетамол"
                      value={dosageDrug}
                      onChange={(e) => setDosageDrug(e.target.value)}
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
                  
                  {dosageResult && (
                    <div className="mt-4 p-4 bg-accent/5 rounded-lg animate-fade-in">
                      <div className="flex items-start gap-2">
                        <Icon name="AlertCircle" className="text-accent mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-accent mb-2">Рекомендуемая дозировка:</p>
                          <p className="text-sm">{dosageResult}</p>
                          <p className="text-xs text-gray-500 mt-3 italic">
                            ⚠️ Перед применением обязательно проконсультируйтесь с врачом
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

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
                      value={pressureSystolic}
                      onChange={(e) => setPressureSystolic(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pressure-dia">Диастолическое (мм рт.ст.)</Label>
                    <Input
                      id="pressure-dia"
                      type="number"
                      placeholder="80"
                      value={pressureDiastolic}
                      onChange={(e) => setPressureDiastolic(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={calculatePressure} className="w-full" size="lg">
                    <Icon name="Calculator" size={18} className="mr-2" />
                    Рассчитать
                  </Button>
                  
                  {pressureResult && (
                    <div className="mt-4 p-4 bg-red-500/5 rounded-lg animate-fade-in">
                      <div className="text-center mb-3">
                        <p className="text-3xl font-bold text-red-500 font-heading">
                          {pressureSystolic}/{pressureDiastolic}
                        </p>
                        <Badge className="mt-2 bg-red-500">
                          {pressureResult}
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
                      value={sugarLevel}
                      onChange={(e) => setSugarLevel(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Tabs value={sugarMealTime} onValueChange={setSugarMealTime} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="fasting">Натощак</TabsTrigger>
                      <TabsTrigger value="after_meal">После еды</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button onClick={calculateSugar} className="w-full" size="lg">
                    <Icon name="Calculator" size={18} className="mr-2" />
                    Рассчитать
                  </Button>
                  
                  {sugarResult && (
                    <div className="mt-4 p-4 bg-yellow-500/5 rounded-lg animate-fade-in">
                      <div className="text-center mb-3">
                        <p className="text-3xl font-bold text-yellow-600 font-heading">
                          {sugarLevel} ммоль/л
                        </p>
                        <Badge className="mt-2 bg-yellow-500">
                          {sugarResult}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-3">
                        {sugarMealTime === 'fasting' ? (
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
                      value={cholesterolTotal}
                      onChange={(e) => setCholesterolTotal(e.target.value)}
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
                      value={cholesterolLDL}
                      onChange={(e) => setCholesterolLDL(e.target.value)}
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
                      value={cholesterolHDL}
                      onChange={(e) => setCholesterolHDL(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={calculateCholesterol} className="w-full" size="lg">
                    <Icon name="Calculator" size={18} className="mr-2" />
                    Рассчитать
                  </Button>
                  
                  {cholesterolResult && (
                    <div className="mt-4 p-4 bg-purple-500/5 rounded-lg animate-fade-in">
                      <div className="text-center mb-3">
                        <p className="text-3xl font-bold text-purple-500 font-heading">
                          {cholesterolTotal} ммоль/л
                        </p>
                        <p className="text-xs mt-2 text-gray-600">{cholesterolResult}</p>
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
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2 font-heading">
                  История расчётов
                </h2>
                <p className="text-gray-600">Все ваши измерения сохраняются локально</p>
              </div>
              {history.length > 0 && (
                <Button variant="destructive" onClick={clearHistory}>
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Очистить историю
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Icon name="History" className="mx-auto text-gray-400 mb-4" size={64} />
                  <p className="text-xl text-gray-600">История пуста</p>
                  <p className="text-sm text-gray-400 mt-2">Начните делать расчёты, чтобы увидеть историю</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {history.map((record) => (
                  <Card key={record.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            record.type === 'bmi' ? 'bg-primary/10' :
                            record.type === 'calories' ? 'bg-secondary/10' :
                            record.type === 'pressure' ? 'bg-red-500/10' :
                            record.type === 'sugar' ? 'bg-yellow-500/10' :
                            'bg-purple-500/10'
                          }`}>
                            <Icon 
                              name={
                                record.type === 'bmi' ? 'Scale' :
                                record.type === 'calories' ? 'Flame' :
                                record.type === 'pressure' ? 'Heart' :
                                record.type === 'sugar' ? 'Droplet' :
                                'TrendingUp'
                              }
                              className={
                                record.type === 'bmi' ? 'text-primary' :
                                record.type === 'calories' ? 'text-secondary' :
                                record.type === 'pressure' ? 'text-red-500' :
                                record.type === 'sugar' ? 'text-yellow-500' :
                                'text-purple-500'
                              }
                              size={24}
                            />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {record.type === 'bmi' && 'ИМТ'}
                              {record.type === 'calories' && 'Калории'}
                              {record.type === 'pressure' && 'Давление'}
                              {record.type === 'sugar' && 'Сахар'}
                              {record.type === 'cholesterol' && 'Холестерин'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(record.date).toLocaleString('ru-RU')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {record.value}
                            {record.type === 'calories' && ' ккал'}
                            {record.type === 'sugar' && ' ммоль/л'}
                            {record.type === 'cholesterol' && ' ммоль/л'}
                          </p>
                          {record.additionalData?.result && (
                            <p className="text-xs text-gray-500 mt-1">{record.additionalData.result}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'charts' && (
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 font-heading">
              Графики динамики показателей
            </h2>

            <div className="grid gap-6">
              {getChartData('bmi').length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Icon name="Scale" className="text-primary" size={24} />
                      Динамика ИМТ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getChartData('bmi')}>
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

              {getChartData('calories').length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Icon name="Flame" className="text-secondary" size={24} />
                      Динамика калорий
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getChartData('calories')}>
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

              {getChartData('sugar').length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Icon name="Droplet" className="text-yellow-500" size={24} />
                      Динамика сахара в крови
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getChartData('sugar')}>
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

              {getChartData('cholesterol').length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading flex items-center gap-2">
                      <Icon name="TrendingUp" className="text-purple-500" size={24} />
                      Динамика холестерина
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getChartData('cholesterol')}>
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
        )}

        {activeTab === 'calculators' && (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none mt-12">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 font-heading">Нужна консультация?</h3>
                  <p className="text-gray-600 mb-4">
                    Наши калькуляторы предоставляют ориентировочные значения. 
                    Для точной диагностики и назначения лечения обратитесь к врачу.
                  </p>
                  <Button size="lg" className="gap-2">
                    <Icon name="Phone" size={18} />
                    Связаться с нами
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/50 p-4 rounded-lg">
                    <Icon name="Users" className="mx-auto text-primary mb-2" size={32} />
                    <p className="text-2xl font-bold text-primary font-heading">12К+</p>
                    <p className="text-xs text-gray-600">Пользователей</p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <Icon name="Calculator" className="mx-auto text-secondary mb-2" size={32} />
                    <p className="text-2xl font-bold text-secondary font-heading">50К+</p>
                    <p className="text-xs text-gray-600">Расчётов</p>
                  </div>
                  <div className="bg-white/50 p-4 rounded-lg">
                    <Icon name="Star" className="mx-auto text-accent mb-2" size={32} />
                    <p className="text-2xl font-bold text-accent font-heading">4.9</p>
                    <p className="text-xs text-gray-600">Рейтинг</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Activity" size={24} />
                <h3 className="text-xl font-bold font-heading">МедКалькулятор</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Современные медицинские калькуляторы для вашего здоровья
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-heading">Разделы</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveTab('calculators')} className="hover:text-white transition-colors">Калькуляторы</button></li>
                <li><button onClick={() => setActiveTab('history')} className="hover:text-white transition-colors">История</button></li>
                <li><button onClick={() => setActiveTab('charts')} className="hover:text-white transition-colors">Графики</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-heading">Поддержка</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Вопросы и ответы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">О проекте</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 font-heading">Контакты</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@medcalc.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© 2024 МедКалькулятор. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
