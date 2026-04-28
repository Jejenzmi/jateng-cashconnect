import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, RotateCcw, RotateCw, ZoomIn, ZoomOut, 
  MousePointer, Square, Circle, Type, 
  Volume2, VolumeX, Image, Download, Upload
} from 'lucide-react';

interface DicomImage {
  id: string;
  patientId: string;
  patientName: string;
  studyDate: string;
  modality: string;
  bodyPart: string;
  imageUrl: string;
  seriesDescription: string;
  imageCount: number;
}

interface DicomAnnotation {
  id: string;
  type: 'measurement' | 'region' | 'text';
  coordinates: { x: number; y: number }[];
  text?: string;
  measurement?: string;
}

interface DicomViewerProps {
  image: DicomImage;
  annotations?: DicomAnnotation[];
  onAnnotationAdd?: (annotation: DicomAnnotation) => void;
  onAnnotationRemove?: (id: string) => void;
}

const DicomViewer: React.FC<DicomViewerProps> = ({ 
  image, 
  annotations = [], 
  onAnnotationAdd,
  onAnnotationRemove
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [windowLevel, setWindowLevel] = useState({ width: 400, center: 50 });
  const [activeTool, setActiveTool] = useState<'select' | 'measure' | 'region' | 'text'>('select');
  
  // Simulasi daftar gambar DICOM untuk studi ini
  const dicomImages: DicomImage[] = Array.from({ length: image.imageCount }, (_, i) => ({
    ...image,
    id: `${image.id}-${i}`,
    imageUrl: `/api/dicom/image/${image.id}/${i}`
  }));

  // Simulasi playback otomatis
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % dicomImages.length);
      }, 1000 / playbackSpeed);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, dicomImages.length]);

  // Fungsi untuk menangani zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.1));
  const handleResetZoom = () => setZoom(1);

  // Fungsi untuk rotasi
  const rotateLeft = () => setRotation(prev => prev - 90);
  const rotateRight = () => setRotation(prev => prev + 90);

  // Fungsi untuk window level
  const adjustWindowLevel = (widthDelta: number, centerDelta: number) => {
    setWindowLevel(prev => ({
      width: Math.max(prev.width + widthDelta, 1),
      center: prev.center + centerDelta
    }));
  };

  // Render gambar DICOM ke canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Kosongkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar gambar DICOM
    const img = new Image();
    img.src = dicomImages[currentImageIndex].imageUrl;
    img.onload = () => {
      // Terapkan transformasi
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      
      // Gambar gambar
      ctx.drawImage(
        img, 
        -img.width / 2, 
        -img.height / 2, 
        img.width, 
        img.height
      );
      
      // Gambar anotasi
      drawAnnotations(ctx, img.width, img.height);
      
      ctx.restore();
    };
  }, [currentImageIndex, rotation, zoom, dicomImages, annotations]);

  // Fungsi untuk menggambar anotasi
  const drawAnnotations = (ctx: CanvasRenderingContext2D, imgWidth: number, imgHeight: number) => {
    annotations.forEach(annotation => {
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      
      if (annotation.type === 'measurement' && annotation.coordinates.length >= 2) {
        // Gambar garis pengukuran
        const start = annotation.coordinates[0];
        const end = annotation.coordinates[1];
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        
        // Tambahkan teks pengukuran
        if (annotation.measurement) {
          ctx.fillStyle = '#FF0000';
          ctx.font = '14px Arial';
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2;
          ctx.fillText(annotation.measurement, midX, midY);
        }
      } else if (annotation.type === 'region' && annotation.coordinates.length >= 3) {
        // Gambar poligon
        ctx.beginPath();
        ctx.moveTo(annotation.coordinates[0].x, annotation.coordinates[0].y);
        for (let i = 1; i < annotation.coordinates.length; i++) {
          ctx.lineTo(annotation.coordinates[i].x, annotation.coordinates[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (annotation.type === 'text' && annotation.coordinates.length >= 1) {
        // Gambar teks
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 16px Arial';
        const pos = annotation.coordinates[0];
        ctx.fillText(annotation.text || '', pos.x, pos.y);
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>DICOM Viewer</span>
            <div className="flex gap-2">
              <Badge variant="secondary">{image.modality}</Badge>
              <Badge variant="outline">{image.bodyPart}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-3/4">
              <div className="bg-black aspect-video flex items-center justify-center relative overflow-hidden rounded">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="max-w-full max-h-[70vh]"
                />
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black/70 text-white px-3 py-1 rounded text-sm">
                    Gambar {currentImageIndex + 1} dari {dicomImages.length}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Jeda' : 'Putar'}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleZoomIn}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleZoomOut}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleResetZoom}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={rotateLeft}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={rotateRight}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => adjustWindowLevel(10, 0)}
                >
                  WL+
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => adjustWindowLevel(-10, 0)}
                >
                  WL-
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div><span className="font-medium">Pasien:</span> {image.patientName}</div>
                  <div><span className="font-medium">Tanggal Studi:</span> {image.studyDate}</div>
                  <div><span className="font-medium">Modalitas:</span> {image.modality}</div>
                  <div><span className="font-medium">Bagian Tubuh:</span> {image.bodyPart}</div>
                  <div><span className="font-medium">Deskripsi Seri:</span> {image.seriesDescription}</div>
                  <div><span className="font-medium">Jumlah Gambar:</span> {image.imageCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Alat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant={activeTool === 'select' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTool('select')}
                    >
                      <MousePointer className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={activeTool === 'measure' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTool('measure')}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={activeTool === 'region' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTool('region')}
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={activeTool === 'text' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveTool('text')}
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Navigasi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                    >
                      &lt;
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max={dicomImages.length - 1}
                      value={currentImageIndex}
                      onChange={(e) => setCurrentImageIndex(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setCurrentImageIndex(prev => Math.min(dicomImages.length - 1, prev + 1))}
                    >
                      &gt;
                    </Button>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Kecepatan:</span>
                      <span>{playbackSpeed} fps</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Unduh
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DicomViewer;