# Tool Development Guide

## ToolLayout Component 사용법

모든 새로운 Tool을 만들 때는 `ToolLayout` 컴포넌트를 사용하세요.
이렇게 하면 "Back to Tools" 링크, 헤더 스타일 등이 자동으로 일관되게 적용됩니다.

### 사용 예시:

```tsx
'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';

export default function YourToolPage() {
  // Your tool logic here...

  return (
    <ToolLayout
      title="Your Tool Title"
      description="Tool description that appears in the header"
      emoji="🎨"
      gradient="from-purple-600 via-pink-600 to-purple-700" // Optional, default gradient
    >
      {/* Your tool content here */}
      <div className="space-y-6">
        {/* Input forms */}
        {/* Results */}
        {/* Share buttons */}
      </div>
    </ToolLayout>
  );
}
```

### ToolLayout이 자동으로 제공하는 것:

✅ **Back to Tools 링크** - 항상 왼쪽 상단에 표시 (SVG 화살표 포함)
✅ **일관된 헤더** - 보라색 그라데이션 배경, 타이틀, 설명
✅ **반응형 컨테이너** - max-w-3xl, 패딩, 마진 등 자동 적용
✅ **카드 스타일** - 흰색 배경, 둥근 모서리, 그림자

### Props:

- `title` (required): 툴 제목
- `description` (required): 툴 설명 (헤더에 표시)
- `emoji` (required): 헤더에 표시할 이모지
- `gradient` (optional): 헤더 그라데이션 색상 (기본값: 보라-핑크)
- `children` (required): 툴의 실제 콘텐츠

### 기존 툴들 업데이트 계획:

- [ ] Tool #1: Korean Name Generator
- [ ] Tool #2: What Would Your Job Be in Korea?
- [ ] Tool #3: Korean Age Calculator
- [ ] Tool #4: Korea Trip Budget Calculator
- [ ] Tool #5: Which Korean City Should You Live In?
- [✅] Tool #6: K-Pop Stage Name Generator (이미 적용됨)

다음 번 툴 업데이트 시 하나씩 적용하면 됩니다.
