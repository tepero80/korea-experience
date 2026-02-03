# 블로그 포스트 날짜 재분배 스크립트
# 2026-01-01부터 2026-02-03까지 601개 포스트를 균등하게 분배

$startDate = Get-Date "2026-01-01"
$endDate = Get-Date "2026-02-03"
$posts = Get-ChildItem -Path "content\posts" -Filter "*.md" | Sort-Object Name

Write-Host "📅 블로그 포스트 날짜 재분배 시작"
Write-Host "기간: $($startDate.ToString('yyyy-MM-dd')) ~ $($endDate.ToString('yyyy-MM-dd'))"
Write-Host "전체 포스트: $($posts.Count)개"
Write-Host "총 일수: $(($endDate - $startDate).Days + 1)일"
Write-Host ""

# 날짜 배열 생성 (34일)
$totalDays = ($endDate - $startDate).Days + 1
$postsPerDay = [math]::Ceiling($posts.Count / $totalDays)

Write-Host "하루 평균: $postsPerDay개 포스트"
Write-Host ""
Write-Host "🔄 날짜 업데이트 중..."

$currentIndex = 0
$updatedCount = 0

for ($day = 0; $day -lt $totalDays; $day++) {
    $currentDate = $startDate.AddDays($day)
    $dateString = $currentDate.ToString("yyyy-MM-dd")
    
    # 각 날짜에 할당할 포스트 수 계산
    $remainingPosts = $posts.Count - $currentIndex
    $remainingDays = $totalDays - $day
    $postsForToday = [math]::Ceiling($remainingPosts / $remainingDays)
    
    Write-Host "  $dateString : $postsForToday개 포스트 할당"
    
    for ($i = 0; $i -lt $postsForToday -and $currentIndex -lt $posts.Count; $i++) {
        $post = $posts[$currentIndex]
        
        # 파일 내용 읽기
        $content = Get-Content $post.FullName -Raw -Encoding UTF8
        
        # date 필드 업데이트 (기존 날짜를 새 날짜로 교체)
        $pattern = 'date:\s*"?\d{4}-\d{2}-\d{2}"?'
        if ($content -match $pattern) {
            $newContent = $content -replace $pattern, "date: $dateString"
            
            # 파일에 쓰기
            Set-Content -Path $post.FullName -Value $newContent -Encoding UTF8 -NoNewline
            $updatedCount++
        }
        
        $currentIndex++
    }
}

Write-Host ""
Write-Host "✅ 완료!"
Write-Host "업데이트된 포스트: $updatedCount개"
Write-Host ""
Write-Host "📊 새로운 날짜 분포:"

# 업데이트된 날짜 분포 확인
$posts = Get-ChildItem -Path "content\posts" -Filter "*.md"
$dateCounts = @{}
foreach ($post in $posts) {
    $datePattern = 'date:\s*(\d{4}-\d{2}-\d{2})'
    $contentSample = Get-Content $post.FullName -Head 20 -Encoding UTF8 | Out-String
    if ($contentSample -match $datePattern) {
        $dateValue = $Matches[1]
        if (-not $dateCounts.ContainsKey($dateValue)) {
            $dateCounts[$dateValue] = 0
        }
        $dateCounts[$dateValue]++
    }
}

$dateCounts.GetEnumerator() | Sort-Object Name | ForEach-Object {
    Write-Host "$($_.Name): $($_.Value)개"
}

Write-Host ""
Write-Host "다음 단계:"
Write-Host "1. git diff를 확인하여 변경사항 검토"
Write-Host "2. git add ."
Write-Host "3. git commit -m 'Redistribute blog post dates from 2026-01-01 to 2026-02-03'"
Write-Host "4. git push"
