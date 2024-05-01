import customSelectClassName from "@/components/ui/customSelectClassName";
import { getSelectColor } from "./color.utils";


export const holdColorCustomSelectClass = {
  ...customSelectClassName,
  option: ({ data, isDisabled, isFocused, isSelected }: { isDisabled: boolean, isFocused: boolean, isSelected: boolean, data: any }) => [
    isFocused
        ? getSelectColor(data.value, 'focused') // bg color focused
        : isDisabled
          ? 'text-neutral-200 dark:text-neutral-800'
          : getSelectColor(data.value, 'default'),// bg color default
    'py-2',
    'px-3',
    !isDisabled &&
    (isSelected ? 'active:bg-gray-200 dark:active:bg-gray-800' : 'active:bg-gray-500')
  ].join(' '),
  singleValue: ({ data, isDisabled }: { data: any, isDisabled: boolean }) => [
    isDisabled ? 'text-neutral-600 dark:text-neutral-400'
               : getSelectColor(data.value, 'dot'),
    'mx-0.5'
  ].join(' '),
}