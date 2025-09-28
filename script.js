document.addEventListener('DOMContentLoaded', () => {
    // 페이지 요소 가져오기
    const firstPage = document.getElementById('first-page');
    const testPage = document.getElementById('test-page');
    const loadingPage = document.getElementById('loading-page');
    const resultPage = document.getElementById('result-page');
    const startBtn = document.getElementById('start-btn');
    const symptomsContainer = document.getElementById('symptoms-container');
    const resultBtn = document.getElementById('result-btn');
    const rank1 = document.getElementById('rank-1');
    const rank2 = document.getElementById('rank-2');
    const rank3 = document.getElementById('rank-3');
    const rank1Container = document.getElementById('rank-1-container');
    const rank2Container = document.getElementById('rank-2-container');
    const rank3Container = document.getElementById('rank-3-container');

    // 💡 증상 목록 및 강도
    const symptomCategories = {
        "피로감": ["가벼운 피로감", "심한 피로감"],
        "발열": ["미열 (37.5°C 이하)", "고열 (38°C 이상)"],
        "기침": ["마른 기침", "가래 기침", "심한 기침"],
        "인후통": ["경미한 인후통", "심한 인후통"],
        "복통": ["경미한 복통", "심한 복통"],
        "구토": ["가벼운 구토", "심한 구토"],
        "설사": ["가벼운 설사", "심한 설사"],
        "근육통": ["경미한 근육통", "심한 근육통"],
        "두통": ["경미한 두통", "심한 두통"],
        "콧물": ["가벼운 콧물", "심한 콧물"],
        "가려움증": ["국소적 가려움증", "전신 가려움증"],
        "발진": ["국소적 발진", "전신 발진"],
        "감각 상실": ["일시적 감각 상실", "영구적 감각 상실"],
        "호흡 곤란": ["경미한 호흡 곤란", "심한 호흡 곤란"],
        "의식 저하": ["약한 의식 저하", "심한 의식 저하"],
        "어지러움": ["가벼운 어지러움", "심한 어지러움"],
        "답답함": ["가슴 답답함"]
    };

    // 💡 증상별 가중치 (강도에 따라 점수 부여)
    const symptomWeights = {
        "가벼운 피로감": 1, "심한 피로감": 2,
        "미열 (37.5°C 이하)": 2, "고열 (38°C 이상)": 4,
        "마른 기침": 2, "가래 기침": 2, "심한 기침": 4,
        "경미한 인후통": 1, "심한 인후통": 3,
        "경미한 복통": 2, "심한 복통": 4,
        "가벼운 구토": 2, "심한 구토": 4,
        "가벼운 설사": 2, "심한 설사": 4,
        "경미한 근육통": 1, "심한 근육통": 3,
        "경미한 두통": 1, "심한 두통": 3,
        "가벼운 콧물": 1, "심한 콧물": 2,
        "국소적 가려움증": 1, "전신 가려움증": 3,
        "국소적 발진": 1, "전신 발진": 3,
        "일시적 감각 상실": 2, "영구적 감각 상실": 5,
        "경미한 호흡 곤란": 3, "심한 호흡 곤란": 5,
        "약한 의식 저하": 3, "심한 의식 저하": 5,
        "가벼운 어지러움": 1, "심한 어지러움": 3,
        "가슴 답답함": 3
    };

    // 💡 질병 데이터 (증상 강도 반영)
    const diseases = {
        "독감": ["고열 (38°C 이상)", "심한 기침", "심한 인후통", "심한 근육통", "심한 두통", "심한 콧물", "심한 피로감"],
        "코로나": ["미열 (37.5°C 이하)", "마른 기침", "경미한 인후통", "심한 두통", "일시적 감각 상실", "심한 호흡 곤란"],
        "알레르기": ["국소적 가려움증", "국소적 발진", "가벼운 피로감", "가벼운 콧물", "가슴 답답함", "마른 기침"],
        "빈혈": ["일시적 감각 상실", "약한 의식 저하", "심한 피로감", "심한 두통", "경미한 호흡 곤란", "가벼운 어지러움"],
        "식중독": ["심한 구토", "심한 설사", "경미한 복통"],
        "장염": ["심한 복통", "가벼운 구토", "가벼운 설사", "경미한 근육통"],
        "천식": ["심한 호흡 곤란", "심한 기침", "가슴 답답함"],
        "비만": ["심한 피로감", "경미한 호흡 곤란", "경미한 근육통", "가벼운 피로감"],
        "아토피 피부염": ["국소적 가려움증", "국소적 발진", "가벼운 피로감"]
    };

    // 첫 페이지에서 '검사하기' 버튼 클릭 시
    startBtn.addEventListener('click', () => {
        firstPage.classList.remove('active');
        testPage.classList.add('active');
    });

    // 증상 버튼 동적 생성
    Object.keys(symptomCategories).forEach(category => {
        const header = document.createElement('h4');
        header.textContent = category;
        symptomsContainer.appendChild(header);

        symptomCategories[category].forEach(symptom => {
            const button = document.createElement('button');
            button.className = 'symptom-btn';
            button.textContent = symptom;
            button.dataset.symptom = symptom;
            symptomsContainer.appendChild(button);
        });
    });

    let selectedSymptoms = new Set();

    // 증상 버튼 클릭 이벤트
    symptomsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('symptom-btn')) {
            target.classList.toggle('selected');
            const symptom = target.dataset.symptom;

            if (target.classList.contains('selected')) {
                selectedSymptoms.add(symptom);
            } else {
                selectedSymptoms.delete(symptom);
            }

            resultBtn.disabled = selectedSymptoms.size === 0;
        }
    });

    // '결과 보기' 버튼 클릭 시
    resultBtn.addEventListener('click', () => {
        if (!resultBtn.disabled) {
            // 로딩 페이지 활성화
            testPage.classList.remove('active');
            loadingPage.classList.add('active');

            // 2초 후 결과 페이지 표시
            setTimeout(() => {
                const diseaseScores = [];

                for (const disease in diseases) {
                    const diseaseSymptoms = diseases[disease];
                    let weightedScore = 0;
                    let maxPossibleScore = 0;

                    diseaseSymptoms.forEach(symptom => {
                        if (symptomWeights.hasOwnProperty(symptom)) {
                            maxPossibleScore += symptomWeights[symptom];
                            if (selectedSymptoms.has(symptom)) {
                                weightedScore += symptomWeights[symptom];
                            }
                        }
                    });

                    let score = 0;
                    if (maxPossibleScore > 0) {
                        score = (weightedScore / maxPossibleScore);
                    }

                    diseaseScores.push({ name: disease, score: score });
                }

                diseaseScores.sort((a, b) => b.score - a.score);

                const totalScore = diseaseScores.reduce((sum, item) => sum + item.score, 0);

                rank1Container.style.display = 'none';
                rank2Container.style.display = 'none';
                rank3Container.style.display = 'none';

                if (diseaseScores.length > 0 && totalScore > 0) {
                    const rank1Score = (diseaseScores[0].score / totalScore) * 100;
                    rank1Container.style.display = 'flex';
                    rank1.textContent = `${diseaseScores[0].name} (${rank1Score.toFixed(1)}%)`;

                    if (diseaseScores.length > 1 && diseaseScores[1].score > 0) {
                        const rank2Score = (diseaseScores[1].score / totalScore) * 100;
                        rank2Container.style.display = 'flex';
                        rank2.textContent = `${diseaseScores[1].name} (${rank2Score.toFixed(1)}%)`;
                    }

                    if (diseaseScores.length > 2 && diseaseScores[2].score > 0) {
                        const rank3Score = (diseaseScores[2].score / totalScore) * 100;
                        rank3Container.style.display = 'flex';
                        rank3.textContent = `${diseaseScores[2].name} (${rank3Score.toFixed(1)}%)`;
                    }
                } else {
                    rank1Container.style.display = 'flex';
                    rank1.textContent = '일치하는 질병이 없습니다.';
                }

                loadingPage.classList.remove('active');
                resultPage.classList.add('active');
            }, 2000); // 2초 (2000밀리초) 로딩 시간
        }
    });
});