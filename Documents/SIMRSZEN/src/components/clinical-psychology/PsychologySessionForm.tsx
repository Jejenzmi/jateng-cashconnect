import React, { useState } from 'react';

interface TherapySession {
  id?: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  therapist: string;
  sessionType: string;
  notes: string;
  interventions: string[];
}

const PsychologySessionForm = () => {
  const [session, setSession] = useState<TherapySession>({
    patientId: '',
    date: '',
    startTime: '',
    endTime: '',
    therapist: '',
    sessionType: '',
    notes: '',
    interventions: ['']
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSession({
      ...session,
      [name]: value
    });
  };

  const handleInterventionChange = (index: number, value: string) => {
    const updatedInterventions = [...session.interventions];
    updatedInterventions[index] = value;
    setSession({
      ...session,
      interventions: updatedInterventions
    });
  };

  const addInterventionField = () => {
    setSession({
      ...session,
      interventions: [...session.interventions, '']
    });
  };

  const removeInterventionField = (index: number) => {
    const updatedInterventions = session.interventions.filter((_, i) => i !== index);
    setSession({
      ...session,
      interventions: updatedInterventions
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Session data:', session);
    alert('Data sesi terapi berhasil disimpan');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Formulir Sesi Terapi Psikologi</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Pasien</label>
            <input
              type="text"
              name="patientId"
              value={session.patientId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              name="date"
              value={session.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Mulai</label>
            <input
              type="time"
              name="startTime"
              value={session.startTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waktu Selesai</label>
            <input
              type="time"
              name="endTime"
              value={session.endTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terapis</label>
            <select
              name="therapist"
              value={session.therapist}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Pilih Terapis</option>
              <option value="Dr. Siti Rahayu">Dr. Siti Rahayu</option>
              <option value="Dr. Budi Santoso">Dr. Budi Santoso</option>
              <option value="Dr. Rina Kusuma">Dr. Rina Kusuma</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Sesi</label>
          <select
            name="sessionType"
            value={session.sessionType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Pilih Jenis Sesi</option>
            <option value="Individual">Terapi Individual</option>
            <option value="Group">Terapi Kelompok</option>
            <option value="Family">Terapi Keluarga</option>
            <option value="Crisis Intervention">Intervensi Krisis</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Sesi</label>
          <textarea
            name="notes"
            value={session.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Intervensi Terapi</label>
            <button
              type="button"
              onClick={addInterventionField}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Tambah Intervensi
            </button>
          </div>
          
          {session.interventions.map((intervention, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={intervention}
                onChange={(e) => handleInterventionChange(index, e.target.value)}
                placeholder={`Intervensi ${index + 1}`}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
              />
              {session.interventions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInterventionField(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Simpan Sesi
          </button>
        </div>
      </form>
    </div>
  );
};

export default PsychologySessionForm;