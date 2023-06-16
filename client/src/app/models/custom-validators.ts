import { FormControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static whiteSpaceCheck(formControl: FormControl): ValidationErrors | null {
    if (formControl.value == null || formControl.value.trim().length < 1) {
      return { whiteSpaceCheck: true };
    }
    return null; // a null return is needed if no errors (instead of false)
  }

  static invalidCreditCardCheck(
    formControl: FormControl
  ): ValidationErrors | null {
    let cardNumber: string = formControl.value;
    if (!cardNumber.length) {
      return { invalidCreditCardCheck: true };
    }

    // Luhn's algorithm to validate credit card numbers
    // Remove any whitespaces from card number
    cardNumber = cardNumber.replace(/\s/g, '');

    // 1. Get last digit for later step
    const lastDigit: number = Number(cardNumber[cardNumber.length - 1]);

    // 2. Excluding the last digit, reverse the card number
    const reversedCardNumbers: number[] = cardNumber
      .slice(0, cardNumber.length - 1)
      .split('')
      .reverse()
      .map((digit) => Number(digit));

    // 3. For every digit in the odd position (actually in even index positions as index starts from 0), multiply by 2 and if the result is more than 9, substract the result by 9
    for (let i = 0; i < reversedCardNumbers.length; i += 2) {
      const doubled = reversedCardNumbers[i] * 2;
      if (doubled > 9) {
        reversedCardNumbers[i] = doubled - 9;
      } else {
        reversedCardNumbers[i] = doubled;
      }
    }

    // 4. Sum the resulting array of numbers from step 3
    let sum: number = 0;
    sum = reversedCardNumbers.reduce((acc, number) => acc + number, 0);

    // 5. credit card number is only valid if (sum + lastDigit) mod 10 is 0
    if ((sum + lastDigit) % 10 === 0) {
      return null;
    }
    return { invalidCreditCardCheck: true };
  }
}
