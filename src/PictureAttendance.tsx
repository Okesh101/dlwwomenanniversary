// import { useEffect, useRef, useState } from "react";
// import { Download, Upload, User, X } from "lucide-react";
// import toast from "react-hot-toast";

// const FLYER_WIDTH = 736;
// const FLYER_HEIGHT = 589;

// const FRAME_X = 104;
// const FRAME_Y = 187;
// const FRAME_W = 183;
// const FRAME_H = 275;

// const NAME_CENTER_X = 540;
// const NAME_BASELINE_Y = 275;
// const NAME_MAX_WIDTH = 300;

// const NAME_FONT_FAMILY = '"Inter", "Helvetica Neue", Arial, sans-serif';
// const NAME_FONT_WEIGHT = 800;
// const NAME_FONT_SIZE = 42;

// export function PictureAttendance() {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const [name, setName] = useState("");
//   const [photo, setPhoto] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState("");
//   const [flyerLoaded, setFlyerLoaded] = useState(false);
//   const flyerImgRef = useRef<HTMLImageElement | null>(null);

//   useEffect(() => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = "/flyer.png";
//     img.onload = () => {
//       flyerImgRef.current = img;
//       setFlyerLoaded(true);
//     };
//     img.onerror = () => {
//       toast.error("Could not load the flyer image. Check /flyer.png exists.");
//     };
//   }, []);

//   useEffect(() => {
//     if (!flyerLoaded) return;
//     void drawCanvas();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [name, photoPreview, flyerLoaded]);

//   const drawCanvas = async () => {
//     const canvas = canvasRef.current;
//     const flyer = flyerImgRef.current;
//     if (!canvas || !flyer) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     canvas.width = FLYER_WIDTH;
//     canvas.height = FLYER_HEIGHT;

//     ctx.clearRect(0, 0, FLYER_WIDTH, FLYER_HEIGHT);
//     ctx.drawImage(flyer, 0, 0, FLYER_WIDTH, FLYER_HEIGHT);

//     if (photoPreview) {
//       await drawPhotoInsideFrame(ctx, photoPreview);
//     }

//     if (name.trim()) {
//       drawName(ctx, name.trim());
//     }
//   };

//   const drawPhotoInsideFrame = (
//     ctx: CanvasRenderingContext2D,
//     src: string,
//   ): Promise<void> => {
//     return new Promise((resolve) => {
//       const img = new Image();
//       img.onload = () => {
//         const imgRatio = img.width / img.height;
//         const frameRatio = FRAME_W / FRAME_H;

//         let sx = 0;
//         let sy = 0;
//         let sw = img.width;
//         let sh = img.height;

//         if (imgRatio > frameRatio) {
//           sw = img.height * frameRatio;
//           sx = (img.width - sw) / 2;
//         } else {
//           sh = img.width / frameRatio;
//           sy = (img.height - sh) / 2;
//         }

//         ctx.save();
//         roundRectPath(ctx, FRAME_X, FRAME_Y, FRAME_W, FRAME_H, 6);
//         ctx.clip();
//         ctx.drawImage(img, sx, sy, sw, sh, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
//         ctx.restore();

//         resolve();
//       };
//       img.onerror = () => resolve();
//       img.src = src;
//     });
//   };

//   const drawName = (ctx: CanvasRenderingContext2D, text: string) => {
//     const words = text.split(/\s+/).filter(Boolean);
//     if (words.length === 0) return;

//     ctx.textAlign = "center";
//     ctx.textBaseline = "alphabetic";

//     let fontSize = NAME_FONT_SIZE;
//     let lines: string[] = [];
//     let fits = false;

//     while (!fits && fontSize >= 16) {
//       ctx.font = `${NAME_FONT_WEIGHT} ${fontSize}px ${NAME_FONT_FAMILY}`;

//       const allWordsFit = words.every(
//         (word) => ctx.measureText(word).width <= NAME_MAX_WIDTH,
//       );

//       if (!allWordsFit) {
//         fontSize -= 2;
//         continue;
//       }

//       const packed: string[] = [];
//       let currentLine = "";

//       for (const word of words) {
//         const testLine = currentLine ? `${currentLine} ${word}` : word;
//         const testWidth = ctx.measureText(testLine).width;

//         if (testWidth <= NAME_MAX_WIDTH) {
//           currentLine = testLine;
//         } else {
//           if (currentLine) packed.push(currentLine);
//           currentLine = word;
//         }
//       }

//       if (currentLine) packed.push(currentLine);
//       lines = packed;
//       fits = true;
//     }

//     if (!fits) {
//       ctx.font = `${NAME_FONT_WEIGHT} 16px ${NAME_FONT_FAMILY}`;
//       lines = [words[0]];
//     }

//     ctx.font = `${NAME_FONT_WEIGHT} ${fontSize}px ${NAME_FONT_FAMILY}`;
//     const lineHeight = Math.round(fontSize * 1.1);
//     const totalHeight = (lines.length - 1) * lineHeight;
//     const startY = NAME_BASELINE_Y - totalHeight / 2;

//     lines.forEach((line, index) => {
//       const y = startY + index * lineHeight;

//       ctx.save();
//       ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
//       ctx.shadowBlur = 10;
//       ctx.shadowOffsetX = 0;
//       ctx.shadowOffsetY = 3;
//       ctx.fillStyle = "#FFFFFF";
//       ctx.font = `${NAME_FONT_WEIGHT} ${fontSize}px ${NAME_FONT_FAMILY}`;
//       ctx.fillText(line, NAME_CENTER_X, y);
//       ctx.restore();

//       ctx.save();
//       ctx.lineWidth = 1.4;
//       ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
//       ctx.font = `${NAME_FONT_WEIGHT} ${fontSize}px ${NAME_FONT_FAMILY}`;
//       ctx.strokeText(line, NAME_CENTER_X, y);
//       ctx.restore();
//     });
//   };

//   const roundRectPath = (
//     ctx: CanvasRenderingContext2D,
//     x: number,
//     y: number,
//     w: number,
//     h: number,
//     r: number,
//   ) => {
//     ctx.beginPath();
//     ctx.moveTo(x + r, y);
//     ctx.lineTo(x + w - r, y);
//     ctx.quadraticCurveTo(x + w, y, x + w, y + r);
//     ctx.lineTo(x + w, y + h - r);
//     ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
//     ctx.lineTo(x + r, y + h);
//     ctx.quadraticCurveTo(x, y + h, x, y + h - r);
//     ctx.lineTo(x, y + r);
//     ctx.quadraticCurveTo(x, y, x + r, y);
//     ctx.closePath();
//   };

//   const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please upload an image file.");
//       return;
//     }

//     if (file.size > 8 * 1024 * 1024) {
//       toast.error("Image is too large. Please use an image under 8MB.");
//       return;
//     }

//     setPhoto(file);
//     const reader = new FileReader();
//     reader.onload = (loadEvent) => {
//       setPhotoPreview(loadEvent.target?.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const clearPhoto = () => {
//     setPhoto(null);
//     setPhotoPreview("");
//   };

//   const handleDownload = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     if (!name.trim() && !photo) {
//       toast.error("Add your name and photo first.");
//       return;
//     }

//     canvas.toBlob((blob) => {
//       if (!blob) {
//         toast.error("Failed to generate the image.");
//         return;
//       }

//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `DLW-Women-Anniversary-${name.trim() || "me"}.png`;
//       link.click();
//       URL.revokeObjectURL(url);
//       toast.success("Flyer downloaded!");
//     }, "image/png");
//   };

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_35%),linear-gradient(180deg,#f5f9ff_0%,#edf6ff_100%)] text-slate-900">
//       <div className="mx-auto flex max-w-md flex-col gap-4">
//         <header className="w-full border-b border-sky-100 bg-white/90 px-0 py-1 shadow-[0_8px_20px_rgba(59,130,246,0.04)] backdrop-blur-sm">
//           <div className="flex items-center gap-3 px-3">
//             <div className="flex items-center">
//               <img
//                 src="/dlw.png"
//                 alt="DLW logo"
//                 className="h-20 w-20 object-contain"
//               />
//               <img
//                 src="/mothers.png"
//                 alt="Women logo"
//                 className="-ml-6 h-13 w-12 object-contain"
//               />
//             </div>

//             <div className="flex flex-col text-left">
//               <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
//                 Diocese of Lagos West <br /> Egbe Archdeaconry
//               </span>
//               <h1 className="text-base font-extrabold leading-tight text-sky-950">
//                 Mother's Anniversary
//               </h1>
//             </div>
//           </div>
//         </header>

//         <div className="rounded-[28px] bg-white/80 p-3 shadow-[0_18px_40px_rgba(37,99,235,0.08)] ring-1 ring-sky-100 backdrop-blur-sm">
//           <div className="rounded-[22px] bg-sky-50 p-2.5">
//             {!flyerLoaded ? (
//               <div className="flex aspect-[736/920] w-full items-center justify-center rounded-[18px] bg-sky-100 text-sm font-medium text-sky-700">
//                 Loading flyer…
//               </div>
//             ) : (
//               <canvas
//                 ref={canvasRef}
//                 className="w-full rounded-[18px] shadow-[0_10px_30px_rgba(59,130,246,0.12)]"
//                 style={{ aspectRatio: `${FLYER_WIDTH} / ${FLYER_HEIGHT}` }}
//               />
//             )}
//           </div>
//         </div>

//         <div className="rounded-[28px] bg-white/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-sky-100 backdrop-blur-sm">
//           <div className="space-y-4">
//             <div>
//               <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-sky-700">
//                 Your Name
//               </label>
//               <div className="relative">
//                 <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
//                 <input
//                   value={name}
//                   onChange={(event) => setName(event.target.value)}
//                   maxLength={60}
//                   placeholder="Enter your name"
//                   className="w-full rounded-2xl border border-sky-200 bg-sky-50 py-3 pl-11 pr-3 text-sm text-sky-950 outline-none transition placeholder:text-sky-400 focus:border-sky-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-sky-700">
//                 Your Photo
//               </label>

//               {!photoPreview ? (
//                 <label
//                   htmlFor="photo-upload"
//                   className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50 px-4 py-8 text-center transition hover:border-sky-300 hover:bg-sky-100"
//                 >
//                   <Upload className="h-6 w-6 text-sky-600" />
//                   <span className="text-sm font-semibold text-sky-800">
//                     Tap to upload a photo
//                   </span>
//                   <span className="text-[11px] text-sky-500">
//                     JPG, PNG or WEBP
//                   </span>
//                 </label>
//               ) : (
//                 <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3">
//                   <img
//                     src={photoPreview}
//                     alt="Preview"
//                     className="h-16 w-16 rounded-xl object-cover ring-1 ring-sky-200"
//                   />
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm font-semibold text-sky-950">
//                       {photo?.name}
//                     </p>
//                     <p className="text-[11px] text-sky-500">
//                       {photo && (photo.size / 1024).toFixed(0)} KB
//                     </p>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={clearPhoto}
//                     className="rounded-full p-2 text-sky-600 transition hover:bg-sky-100"
//                     aria-label="Remove photo"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </div>
//               )}

//               <input
//                 id="photo-upload"
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePhotoChange}
//                 className="hidden"
//               />
//             </div>

//             <button
//               type="button"
//               onClick={handleDownload}
//               disabled={!flyerLoaded}
//               className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-base font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.28)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <Download className="h-4 w-4" />
//               Download Flyer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Download, Upload, User, X } from "lucide-react";
import toast from "react-hot-toast";

const FLYER_WIDTH = 736;
const FLYER_HEIGHT = 589;

const FRAME_X = 104;
const FRAME_Y = 187;
const FRAME_W = 183;
const FRAME_H = 275;

const NAME_CENTER_X = 540;
const NAME_BASELINE_Y = 275;
const NAME_MAX_WIDTH = 300;

const NAME_FONT_FAMILY = '"Inter", "Helvetica Neue", Arial, sans-serif';
const NAME_FONT_WEIGHT = 800;
const NAME_FONT_SIZE = 42;

export function PictureAttendance(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [flyerLoaded, setFlyerLoaded] = useState<boolean>(false);
  const flyerImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/flyer.png";
    img.onload = () => {
      flyerImgRef.current = img;
      setFlyerLoaded(true);
    };
    img.onerror = () => {
      toast.error("Could not load the flyer image. Check /flyer.png exists.");
    };
  }, []);

  useEffect(() => {
    if (!flyerLoaded) return;
    void drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, photoPreview, flyerLoaded]);

  const drawCanvas = async (): Promise<void> => {
    const canvas = canvasRef.current;
    const flyer = flyerImgRef.current;
    if (!canvas || !flyer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = FLYER_WIDTH;
    canvas.height = FLYER_HEIGHT;

    ctx.clearRect(0, 0, FLYER_WIDTH, FLYER_HEIGHT);
    ctx.drawImage(flyer, 0, 0, FLYER_WIDTH, FLYER_HEIGHT);

    if (photoPreview) {
      await drawPhotoInsideFrame(ctx, photoPreview);
    }

    if (name.trim()) {
      drawName(ctx, name.trim());
    }
  };

  const drawPhotoInsideFrame = (
    ctx: CanvasRenderingContext2D,
    src: string,
  ): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const imgRatio = img.width / img.height;
        const frameRatio = FRAME_W / FRAME_H;

        let sx = 0;
        let sy = 0;
        let sw = img.width;
        let sh = img.height;

        if (imgRatio > frameRatio) {
          sw = img.height * frameRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / frameRatio;
          sy = (img.height - sh) / 2;
        }

        ctx.save();
        roundRectPath(ctx, FRAME_X, FRAME_Y, FRAME_W, FRAME_H, 6);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sw, sh, FRAME_X, FRAME_Y, FRAME_W, FRAME_H);
        ctx.restore();

        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    });
  };

  const drawName = (ctx: CanvasRenderingContext2D, text: string): void => {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) return;

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    let fontSize = NAME_FONT_SIZE;
    let lines: string[] = [];
    let fits = false;

    while (!fits && fontSize >= 16) {
      ctx.font = `${NAME_FONT_WEIGHT} ${fontSize}px ${NAME_FONT_FAMILY}`;

      const allWordsFit = words.every(
        (word) => ctx.measureText(word).width <= NAME_MAX_WIDTH,
      );

      if (!allWordsFit) {
        fontSize -= 2;
        continue;
      }

      const packed: string[] = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth <= NAME_MAX_WIDTH) {
          currentLine = testLine;
        } else {
          if (currentLine) packed.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) packed.push(currentLine);
      lines = packed;
      fits = true;
    }

    if (!fits) {
      ctx.font = `${NAME_FONT_WEIGHT} 16px ${NAME_FONT_FAMILY}`;
      lines = [words[0]];
    }

    ctx.font = `${NAME_FONT_WEIGHT} ${fontSize}px ${NAME_FONT_FAMILY}`;
    const lineHeight = Math.round(fontSize * 1.1);
    const totalHeight = (lines.length - 1) * lineHeight;
    const startY = NAME_BASELINE_Y - totalHeight / 2;

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;

      ctx.save();
      ctx.shadowColor = "rgba(15, 23, 42, 0.45)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `${NAME_FONT_WEIGHT} ${fontSize}px ${NAME_FONT_FAMILY}`;
      ctx.fillText(line, NAME_CENTER_X, y);
      ctx.restore();

      ctx.save();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
      ctx.font = `${NAME_FONT_WEIGHT} ${fontSize}px ${NAME_FONT_FAMILY}`;
      ctx.strokeText(line, NAME_CENTER_X, y);
      ctx.restore();
    });
  };

  const roundRectPath = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image is too large. Please use an image under 8MB.");
      return;
    }

    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      setPhotoPreview(loadEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearPhoto = (): void => {
    setPhoto(null);
    setPhotoPreview("");
  };

  const handleDownload = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!name.trim() && !photo) {
      toast.error("Add your name and photo first.");
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Failed to generate the image.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `DLW-Women-Anniversary-${name.trim() || "me"}.png`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Flyer downloaded!");
    }, "image/png");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_35%),linear-gradient(180deg,#f5f9ff_0%,#edf6ff_100%)] text-slate-900">
      {/* 1. Top-level Header spanning full page width */}
      <header className="w-full border-b border-sky-100 bg-white/90 py-1.5 shadow-[0_8px_20px_rgba(59,130,246,0.04)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-md items-center gap-3 px-3">
          <div className="flex items-center">
            <img
              src="/dlw.png"
              alt="DLW logo"
              className="h-20 w-20 object-contain"
            />
            <img
              src="/mothers.png"
              alt="Women logo"
              className="-ml-6 h-13 w-12 object-contain"
            />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600">
              Diocese of Lagos West <br /> Egbe Archdeaconry
            </span>
            <h1 className="text-base font-extrabold leading-tight text-sky-950">
              Mother's Anniversary
            </h1>
          </div>
        </div>
      </header>

      {/* 2. Main body centered within max-w-md container */}
      <div className="mx-auto flex max-w-md flex-col gap-4 p-4">
        <div className="rounded-[28px] bg-white/80 p-3 shadow-[0_18px_40px_rgba(37,99,235,0.08)] ring-1 ring-sky-100 backdrop-blur-sm">
          <div className="rounded-[22px] bg-sky-50 p-2.5">
            {!flyerLoaded ? (
              <div className="flex aspect-[736/920] w-full items-center justify-center rounded-[18px] bg-sky-100 text-sm font-medium text-sky-700">
                Loading flyer…
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="w-full rounded-[18px] shadow-[0_10px_30px_rgba(59,130,246,0.12)]"
                style={{ aspectRatio: `${FLYER_WIDTH} / ${FLYER_HEIGHT}` }}
              />
            )}
          </div>
        </div>

        <div className="rounded-[28px] bg-white/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-sky-100 backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-sky-700">
                Your Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />
                <input
                  value={name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setName(event.target.value)
                  }
                  maxLength={60}
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border border-sky-200 bg-sky-50 py-3 pl-11 pr-3 text-sm text-sky-950 outline-none transition placeholder:text-sky-400 focus:border-sky-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-sky-700">
                Your Photo
              </label>

              {!photoPreview ? (
                <label
                  htmlFor="photo-upload"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50 px-4 py-8 text-center transition hover:border-sky-300 hover:bg-sky-100"
                >
                  <Upload className="h-6 w-6 text-sky-600" />
                  <span className="text-sm font-semibold text-sky-800">
                    Tap to upload a photo
                  </span>
                  <span className="text-[11px] text-sky-500">
                    JPG, PNG or WEBP
                  </span>
                </label>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-16 w-16 rounded-xl object-cover ring-1 ring-sky-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-sky-950">
                      {photo?.name}
                    </p>
                    <p className="text-[11px] text-sky-500">
                      {photo && (photo.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="rounded-full p-2 text-sky-600 transition hover:bg-sky-100"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!flyerLoaded}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-base font-semibold text-white shadow-[0_14px_28px_rgba(37,99,235,0.28)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className="h-4 w-4" />
              Download Flyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}