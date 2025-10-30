import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
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

  const calculateBMI = () => {
    const height = parseFloat(bmiHeight) / 100;
    const weight = parseFloat(bmiWeight);
    if (height > 0 && weight > 0) {
      const bmi = weight / (height * height);
      setBmiResult(Math.round(bmi * 10) / 10);
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
      setCaloriesResult(Math.round(bmr));
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
              <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="Home" size={20} />
                Главная
              </a>
              <a href="#calculators" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="Calculator" size={20} />
                Калькуляторы
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="BookOpen" size={20} />
                Инструкции
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="Library" size={20} />
                Справочник
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="MessageCircle" size={20} />
                Вопросы
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-2">
                <Icon name="Mail" size={20} />
                Контакты
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 font-heading">
            Медицинские калькуляторы
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Быстрые и точные расчёты для здоровья и медицинских назначений
          </p>
        </div>

        <div id="calculators" className="grid md:grid-cols-3 gap-6 mb-12">
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
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
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
                <li><a href="#" className="hover:text-white transition-colors">Главная</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Калькуляторы</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Инструкции</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Справочник</a></li>
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
