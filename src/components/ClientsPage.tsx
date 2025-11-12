import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

interface Booking {
  id: number;
  date: Date;
  time: string;
  description: string;
  notificationEnabled: boolean;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  bookings: Booking[];
}

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: 'Иванова Мария Петровна',
      phone: '+7 (999) 123-45-67',
      email: 'maria@mail.ru',
      address: 'г. Москва, ул. Ленина, д. 10',
      bookings: [
        {
          id: 1,
          date: new Date(2025, 10, 15),
          time: '14:00',
          description: 'Свадебная фотосессия в студии',
          notificationEnabled: true,
        },
      ],
    },
    {
      id: 2,
      name: 'Петров Сергей Иванович',
      phone: '+7 (999) 987-65-43',
      email: 'sergey@mail.ru',
      address: 'г. Москва, ул. Пушкина, д. 5',
      bookings: [
        {
          id: 2,
          date: new Date(2025, 10, 16),
          time: '16:30',
          description: 'Консультация по выбору пакета услуг',
          notificationEnabled: true,
        },
      ],
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isEditBookingDialogOpen, setIsEditBookingDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [newBooking, setNewBooking] = useState({
    time: '',
    description: '',
    notificationEnabled: true,
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
  ];

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone) {
      toast.error('Заполните обязательные поля');
      return;
    }
    const client: Client = {
      id: Date.now(),
      ...newClient,
      bookings: [],
    };
    setClients([...clients, client]);
    setNewClient({ name: '', phone: '', email: '', address: '' });
    setIsAddDialogOpen(false);
    toast.success('Клиент успешно добавлен');
  };

  const handleUpdateClient = () => {
    if (!editingClient) return;
    setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
    setIsEditDialogOpen(false);
    setEditingClient(null);
    toast.success('Данные клиента обновлены');
  };

  const handleDeleteClient = (clientId: number) => {
    setClients(clients.filter(c => c.id !== clientId));
    setSelectedClient(null);
    toast.success('Клиент удалён');
  };

  const handleAddBooking = () => {
    if (!selectedClient || !selectedDate || !newBooking.time) {
      toast.error('Заполните все поля');
      return;
    }
    const booking: Booking = {
      id: Date.now(),
      date: selectedDate,
      time: newBooking.time,
      description: newBooking.description,
      notificationEnabled: newBooking.notificationEnabled,
    };
    
    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, bookings: [...c.bookings, booking] }
        : c
    ));
    
    setNewBooking({ time: '', description: '', notificationEnabled: true });
    setSelectedDate(undefined);
    setIsBookingDialogOpen(false);
    
    if (booking.notificationEnabled) {
      toast.success('Бронирование создано! Уведомление будет отправлено за 1 день до встречи');
    } else {
      toast.success('Бронирование создано');
    }
  };

  const handleUpdateBooking = () => {
    if (!selectedClient || !editingBooking) return;
    
    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? {
            ...c,
            bookings: c.bookings.map(b => 
              b.id === editingBooking.id ? editingBooking : b
            )
          }
        : c
    ));
    
    setIsEditBookingDialogOpen(false);
    setEditingBooking(null);
    toast.success('Бронирование обновлено');
  };

  const handleDeleteBooking = (bookingId: number) => {
    if (!selectedClient) return;
    
    setClients(clients.map(c => 
      c.id === selectedClient.id 
        ? { ...c, bookings: c.bookings.filter(b => b.id !== bookingId) }
        : c
    ));
    
    setIsEditBookingDialogOpen(false);
    setEditingBooking(null);
    toast.success('Бронирование удалено');
  };

  const allBookedDates = clients.flatMap(c => c.bookings.map(b => b.date));

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient({ ...client });
    setIsEditDialogOpen(true);
  };

  const openBookingDialog = (client: Client) => {
    setSelectedClient(client);
    setIsBookingDialogOpen(true);
  };

  const openEditBookingDialog = (booking: Booking) => {
    setEditingBooking({ ...booking });
    setIsEditBookingDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Система учёта клиентов</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg hover-scale">
              <Icon name="UserPlus" size={20} className="mr-2" />
              Добавить клиента
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Новый клиент</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ф.И.О. *</Label>
                <Input
                  id="name"
                  placeholder="Иванов Иван Иванович"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  placeholder="+7 (___) ___-__-__"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  placeholder="г. Москва, ул..."
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <Button onClick={handleAddClient} className="w-full rounded-xl">
                Сохранить
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Users" className="mr-2 text-primary" size={24} />
                База клиентов ({clients.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
              {clients.map((client) => (
                <Card
                  key={client.id}
                  className="hover:shadow-md transition-all cursor-pointer border-2"
                  onClick={() => handleClientSelect(client)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{client.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Icon name="Phone" size={14} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{client.phone}</span>
                        </div>
                      </div>
                      {client.bookings.length > 0 && (
                        <Badge className="bg-green-500">
                          {client.bookings.length} встреч
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Mail" size={14} />
                      <span>{client.email || 'Не указан'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Icon name="MapPin" size={14} />
                      <span>{client.address || 'Не указан'}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-lg border-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Calendar" className="mr-2 text-secondary" size={24} />
                Календарь бронирования
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl border shadow-sm"
                modifiers={{
                  booked: allBookedDates,
                }}
                modifiersClassNames={{
                  booked: 'bg-primary text-white hover:bg-primary/90 font-bold',
                }}
              />
              <div className="mt-4 p-4 bg-muted/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Icon name="Info" className="text-primary mt-1" size={20} />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Подсказка:</p>
                    <p className="text-muted-foreground">
                      Забронированные даты выделены. Выберите клиента и дату для создания встречи.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedClient && (
            <Card className="shadow-lg border-2 animate-scale-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {selectedClient.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(selectedClient)}
                      className="rounded-full"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openBookingDialog(selectedClient)}
                      className="rounded-full bg-primary text-white hover:bg-primary/90"
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 p-3 bg-muted/30 rounded-xl">
                  <div>
                    <Label className="text-muted-foreground text-xs">Телефон</Label>
                    <p className="font-semibold">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Email</Label>
                    <p className="font-semibold">{selectedClient.email || 'Не указан'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Адрес</Label>
                    <p className="font-semibold">{selectedClient.address || 'Не указан'}</p>
                  </div>
                </div>

                {selectedClient.bookings.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Встречи ({selectedClient.bookings.length})</Label>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {selectedClient.bookings.map((booking) => (
                        <Card 
                          key={booking.id} 
                          className="cursor-pointer hover:shadow-md transition-all"
                          onClick={() => openEditBookingDialog(booking)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon name="Calendar" size={16} className="text-primary" />
                                <span className="font-semibold">
                                  {booking.date.toLocaleDateString('ru-RU')}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {booking.time}
                              </Badge>
                            </div>
                            {booking.description && (
                              <p className="text-sm text-muted-foreground">{booking.description}</p>
                            )}
                            {booking.notificationEnabled && (
                              <div className="flex items-center gap-1 mt-2">
                                <Icon name="Bell" size={12} className="text-green-500" />
                                <span className="text-xs text-green-600">Уведомление включено</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактирование клиента</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Ф.И.О.</Label>
                <Input
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input
                  value={editingClient.phone}
                  onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Адрес</Label>
                <Input
                  value={editingClient.address}
                  onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateClient} className="flex-1 rounded-xl">
                  Сохранить
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteClient(editingClient.id)}
                  className="rounded-xl"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Новое бронирование</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Дата</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl border"
                modifiers={{
                  booked: allBookedDates,
                }}
                modifiersClassNames={{
                  booked: 'bg-primary/20',
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Время</Label>
              <Select value={newBooking.time} onValueChange={(v) => setNewBooking({ ...newBooking, time: v })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea
                placeholder="Фотосессия, консультация..."
                value={newBooking.description}
                onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
                className="rounded-xl"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="notification"
                checked={newBooking.notificationEnabled}
                onChange={(e) => setNewBooking({ ...newBooking, notificationEnabled: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="notification" className="cursor-pointer">
                Включить уведомления
              </Label>
            </div>
            <Button onClick={handleAddBooking} className="w-full rounded-xl">
              Создать бронирование
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditBookingDialogOpen} onOpenChange={setIsEditBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактирование встречи</DialogTitle>
          </DialogHeader>
          {editingBooking && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Дата</Label>
                <Input
                  type="date"
                  value={editingBooking.date.toISOString().split('T')[0]}
                  onChange={(e) => setEditingBooking({ ...editingBooking, date: new Date(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Время</Label>
                <Select 
                  value={editingBooking.time} 
                  onValueChange={(v) => setEditingBooking({ ...editingBooking, time: v })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={editingBooking.description}
                  onChange={(e) => setEditingBooking({ ...editingBooking, description: e.target.value })}
                  className="rounded-xl"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-notification"
                  checked={editingBooking.notificationEnabled}
                  onChange={(e) => setEditingBooking({ ...editingBooking, notificationEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-notification" className="cursor-pointer">
                  Включить уведомления
                </Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateBooking} className="flex-1 rounded-xl">
                  Сохранить
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteBooking(editingBooking.id)}
                  className="rounded-xl"
                >
                  <Icon name="Trash2" size={18} />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;
