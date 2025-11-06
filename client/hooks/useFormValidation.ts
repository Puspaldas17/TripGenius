import { useState, useCallback } from "react";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

const defaultValidators = {
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },
  password: (value: string): string | null => {
    if (value.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(value)) {
      return "Password must contain an uppercase letter";
    }
    if (!/[0-9]/.test(value)) {
      return "Password must contain a number";
    }
    return null;
  },
  name: (value: string): string | null => {
    if (value.trim().length < 2) {
      return "Name must be at least 2 characters";
    }
    return null;
  },
};

export function useFormValidation<T extends Record<string, any>>(
  rules: ValidationRules,
) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validateField = useCallback(
    (name: string, value: string): string | null => {
      const rule = rules[name];
      if (!rule) return null;

      // Required validation
      if (rule.required && !value.trim()) {
        return "This field is required";
      }

      if (value) {
        // Min length
        if (rule.minLength && value.length < rule.minLength) {
          return `Minimum ${rule.minLength} characters required`;
        }

        // Max length
        if (rule.maxLength && value.length > rule.maxLength) {
          return `Maximum ${rule.maxLength} characters allowed`;
        }

        // Pattern
        if (rule.pattern && !rule.pattern.test(value)) {
          return "Invalid format";
        }

        // Custom validation
        if (rule.custom) {
          const error = rule.custom(value);
          if (error) return error;
        }

        // Default validators
        if (
          name === "email" &&
          defaultValidators.email &&
          !(rule.custom && rule.custom(value) === null)
        ) {
          const error = defaultValidators.email(value);
          if (error) return error;
        }

        if (
          name === "password" &&
          defaultValidators.password &&
          !(rule.custom && rule.custom(value) === null)
        ) {
          const error = defaultValidators.password(value);
          if (error) return error;
        }

        if (
          name === "name" &&
          defaultValidators.name &&
          !(rule.custom && rule.custom(value) === null)
        ) {
          const error = defaultValidators.name(value);
          if (error) return error;
        }
      }

      return null;
    },
    [rules],
  );

  const handleBlur = useCallback((name: string) => {
    setTouched((prev) => new Set(prev).add(name));
  }, []);

  const handleChange = useCallback(
    (name: string, value: string) => {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }));
    },
    [validateField],
  );

  const validateAll = useCallback(
    (values: T): boolean => {
      const newErrors: FormErrors = {};
      let isValid = true;

      Object.keys(rules).forEach((field) => {
        const value = (values as any)[field] || "";
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [rules, validateField],
  );

  return {
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setErrors,
  };
}
