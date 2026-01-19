import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
interface LoadTrainingProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function LoadTraining({ isOpen, onOpenChange }: LoadTrainingProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          onClick={(e) => {
            e.stopPropagation();
            onOpenChange(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Día
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {"Cargar Entrenamiento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nombre del día
            </Label>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {"Guardar Entrenamiento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default LoadTraining;
