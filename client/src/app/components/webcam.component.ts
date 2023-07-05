import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as faceapi from 'face-api.js';
import { Subject, Subscription } from 'rxjs';
import { Product } from '../models/product';
import { FittingService } from '../services/fitting-service';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart-item';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css'],
})
export class WebcamComponent implements OnInit, OnDestroy {
  @ViewChild('videoFeed')
  videoElRef!: ElementRef;
  faceDetectionInterval!: NodeJS.Timer; // 'debounce' time
  selectedProduct$!: Subscription;
  selectedProduct!: Product;
  @Output() close = new Subject<void>();

  constructor(
    private elRef: ElementRef,
    private fittingService: FittingService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    this.selectedProduct$ =
      this.fittingService.selectedProductForFitting.subscribe(
        (product) => (this.selectedProduct = product)
      );
    // load face detection models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('../assets/models'),
      await faceapi.nets.faceLandmark68Net.loadFromUri('../assets/models'),
      await faceapi.nets.faceRecognitionNet.loadFromUri('../assets/models'),
      await faceapi.nets.faceExpressionNet.loadFromUri('../assets/models'),
    ]).then(() => this.startVideo());
  }

  ngOnDestroy(): void {
    this.selectedProduct$.unsubscribe();
  }

  startVideo() {
    // start webcam
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => (this.videoElRef.nativeElement.srcObject = stream))
      .catch((err) => console.info(err));

    // detect face and position product every 100 milliseconds
    this.faceDetectionInterval = setInterval(async () => {
      const positioning: any = await this.detectFace();
      if (positioning) {
        this.positionProduct(positioning._box); // position the product
      }
    }, 100);
    // this.detectFaces();
  }

  stopVideo() {
    // stop face detection intervals and remove product's visibility css
    clearInterval(this.faceDetectionInterval);
    this.elRef.nativeElement
      .querySelector('#product')
      .classList.remove('visible');

    // stop video source
    if (this.videoElRef.nativeElement.srcObject) {
      this.videoElRef.nativeElement.srcObject.getTracks().forEach((t: any) => {
        t.stop();
      });
      this.videoElRef.nativeElement.srcObject = null;
    }
  }

  async detectFace() {
    // detect face from video input
    return await faceapi.detectSingleFace(
      this.elRef.nativeElement.querySelector('video'),
      new faceapi.TinyFaceDetectorOptions()
    );
  }

  positionProduct(box: Box): void {
    // make product visible and superimpose on to video based on box boundaries of detected face
    this.elRef.nativeElement.querySelector('#product').classList.add('visible');
    this.elRef.nativeElement
      .querySelector('#product')
      .setAttribute(
        'style',
        `top: ${box._y - box._height}px; left: ${box._x}px; width: ${
          box._width
        }px; height: ${box._height}px`
      );
  }

  addToCart() {
    this.cartService.addToCart(new CartItem(this.selectedProduct));
    alert(`${this.selectedProduct.name} successfully added to cart!`);
    this.onClose();
  }

  onClose() {
    this.stopVideo();
    this.close.next();
  }
}

interface Box {
  _x: number;
  _y: number;
  _width: number;
  _height: number;
}
