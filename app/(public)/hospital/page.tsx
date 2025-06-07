"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HospitalPage() {
    return (
        <div>
            {/* 圖片動畫：由右至左匯入 */}
            <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, type: "spring" }}
            >
                <Image
                    src="/images/hos.jpg"
                    alt="Hospital Image"
                    width={1200}
                    height={600}
                    className="w-full h-100 object-cover"
                />
            </motion.div>
            <motion.h1
                className="text-2xl font-bold text-center my-8"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, type: "spring", delay: 0.2 }}
            >
                關於本院
            </motion.h1>
            {/* 文字內容動畫：由右至左匯入 */}
            <motion.div
                className="max-w-3xl mx-auto text-gray-700 leading-8 space-y-4"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, type: "spring", delay: 0.4 }}
            >
                <p>
                    本院自創立以來，始終秉持「以病人為中心、以品質為根本」的理念，致力於提供全方位、高品質且溫暖的醫療服務。我們相信，真正優質的醫療不僅僅在於技術的精進與設備的現代化，更來自於對每一位病患身心靈的全面關懷。
                </p>
                <p>
                    為了實現這個目標，我們匯聚了來自各專科領域的醫療人才，組成專業且具人文關懷的醫療團隊，並持續引進國內外先進的醫療技術與設備，提升診療品質，縮短病患等待時間，優化就醫體驗。本院設有內科、外科、婦產科、小兒科、急診醫學科等多個主要科別，同時發展多項特色醫療，如高齡整合照護、慢性病管理、健康檢查中心及復健醫學等，全面滿足不同年齡層患者的需求。
                </p>
                <p>
                    我們深知，醫療服務的品質，不僅來自醫師的專業，更來自每一位同仁的用心與努力。因此，本院重視醫護人員的持續教育與團隊合作，定期舉辦專業訓練與品質改善計畫，確保所有員工都能以最新的知識與最人性化的態度服務病患。此外，我們也積極推動智慧醫療與數位化轉型，運用資訊科技強化病歷管理與診療流程，提升醫療效率與安全性。
                </p>
                <p>
                    在面對快速變遷的醫療環境與多元社會需求時，本院將持續扮演地區健康守護者的角色，深化社區連結，推動健康教育、疫苗接種、慢性病預防與長照支持等公共衛生服務，與在地居民攜手共築健康生活。
                </p>
                <p>
                    而我們相信，每一位來到本院的病患與家屬，無論處於什麼樣的身心狀況，都應獲得尊重、理解與最合適的照顧。本院將以專業為基礎，以愛與責任為動力，繼續為社會大眾提供值得信賴的醫療服務，成為您一生健康路上的最佳夥伴。
                </p>
                <p>
                    我們誠摯邀請您來到本院，體驗我們的專業醫療服務與溫暖關懷。無論是健康檢查、疾病診療或是康復治療，我們都將竭誠為您提供最優質的醫療照護。
                </p>
                <p></p>

            </motion.div>
        </div>
    );
}