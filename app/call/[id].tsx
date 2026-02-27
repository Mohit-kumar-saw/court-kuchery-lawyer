import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";

import { AppColors } from "@/constants/theme";
import { consultService } from "@/services/consultService";
import { socketService } from "@/services/socket";
import { useAuth } from "@/contexts";

export default function LawyerCallScreen() {
    const { id } = useLocalSearchParams<{ id: string }>(); // sessionId
    const { trackActiveSession, clearActiveSession } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [seconds, setSeconds] = useState(0);
    const [sessionActive, setSessionActive] = useState(true);

    const [summaryVisible, setSummaryVisible] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                if (!id) return;
                await trackActiveSession(id);
                const res = await consultService.getSessionDetails(id);
                setSession(res.session);
            } catch (error) {
                console.error("LOAD CALL ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, [id]);

    useEffect(() => {
        let socket: any;
        let timer: any;

        const setupSocket = async () => {
            socket = await socketService.initialize();
            if (socket && id) {
                socket.emit("JOIN_SESSION", { sessionId: id });

                setSessionActive(true);
                timer = setInterval(() => {
                    setSeconds((prev) => prev + 1);
                }, 1000);

                socket.on("SESSION_ENDED", (data: any) => {
                    handleCallEnd(data);
                });

                socket.on("SESSION_FORCE_ENDED", (data: any) => {
                    handleCallEnd(data);
                });
            }
        };

        setupSocket();

        return () => {
            if (socket) {
                socket.emit("LEAVE_SESSION", { sessionId: id });
                socket.off("SESSION_ENDED");
                socket.off("SESSION_FORCE_ENDED");
            }
            if (timer) clearInterval(timer);
        };
    }, [id]);

    const handleCallEnd = (data: any) => {
        setSummary(data);
        setSummaryVisible(true);
        setSessionActive(false);
    };

    const endCall = async () => {
        if (!id) return;
        try {
            const res = await consultService.endSession(id);
            await clearActiveSession();
            handleCallEnd(res);
        } catch (err) {
            console.error("END CALL ERROR:", err);
            router.back();
        }
    };

    const formatDuration = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={AppColors.primary} />
            </View>
        );
    }

    if (!session) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Session not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                    <Text style={styles.backLinkText}>Go back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const clientName = session.userId?.name || "Client";

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarFallback}>
                        <Text style={styles.avatarText}>
                            {clientName.split(" ").map((n: string) => n[0]).join("")}
                        </Text>
                    </View>
                </View>

                <Text style={styles.name}>{clientName}</Text>
                <Text style={styles.specialty}>Consultation Call</Text>
                <Text style={styles.status}>
                    {sessionActive ? formatDuration(seconds) : "Call Ended"}
                </Text>

                <View style={styles.actions}>
                    <View style={styles.actionBtn}>
                        <View style={styles.actionCircle}>
                            <Ionicons name="mic" size={28} color="#fff" />
                        </View>
                        <Text style={styles.actionLabel}>Mute</Text>
                    </View>
                    <View style={styles.actionBtn}>
                        <View style={styles.actionCircle}>
                            <Ionicons name="volume-high" size={28} color="#fff" />
                        </View>
                        <Text style={styles.actionLabel}>Speaker</Text>
                    </View>
                </View>

                {sessionActive && (
                    <TouchableOpacity style={styles.endCallBtn} onPress={endCall}>
                        <Ionicons name="call" size={32} color="#fff" />
                    </TouchableOpacity>
                )}
                {sessionActive && <Text style={styles.endCallLabel}>End Call</Text>}
            </View>

            {summaryVisible && summary && (
                <View style={styles.summaryOverlay}>
                    <View style={styles.summaryContainer}>
                        <Ionicons name="checkmark-circle" size={64} color={AppColors.success} />
                        <Text style={styles.summaryTitle}>Consultation Ended</Text>

                        <View style={styles.summaryStats}>
                            <View style={styles.summaryStat}>
                                <Text style={styles.summaryLabel}>Total Earning</Text>
                                <Text style={styles.summaryValue}>₹{(summary.lawyerEarning || 0).toFixed(2)}</Text>
                            </View>
                            <View style={styles.summaryStat}>
                                <Text style={styles.summaryLabel}>Duration</Text>
                                <Text style={styles.summaryValue}>
                                    {summary.durationSeconds ? Math.ceil(summary.durationSeconds / 60) : 0} mins
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.summaryBtn}
                            onPress={async () => {
                                await clearActiveSession();
                                router.replace("/my-cases");
                            }}
                        >
                            <Text style={styles.summaryBtnText}>Back to Cases</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0d1f17" },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d1f17" },
    errorText: { color: "#fff", fontSize: 16 },
    backLink: { marginTop: 16, padding: 12 },
    backLinkText: { color: AppColors.primary, fontSize: 16 },
    content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
    avatarWrapper: { marginBottom: 24 },
    avatarFallback: { width: 140, height: 140, borderRadius: 70, backgroundColor: AppColors.primary, alignItems: "center", justifyContent: "center" },
    avatarText: { color: "#fff", fontWeight: "700", fontSize: 48 },
    name: { color: "#fff", fontSize: 28, fontWeight: "700" },
    specialty: { color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 6 },
    status: { color: "rgba(255,255,255,0.8)", fontSize: 16, marginTop: 12 },
    actions: { flexDirection: "row", marginTop: 60, gap: 40 },
    actionBtn: { alignItems: "center" },
    actionCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
    actionLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 8 },
    endCallBtn: { marginTop: 50, width: 72, height: 72, borderRadius: 36, backgroundColor: "#dc3545", alignItems: "center", justifyContent: "center", transform: [{ rotate: "135deg" }] },
    endCallLabel: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 12 },
    summaryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(15, 23, 42, 0.9)", justifyContent: "center", alignItems: "center", padding: 24, zIndex: 1000 },
    summaryContainer: { backgroundColor: "#fff", borderRadius: 24, padding: 32, width: "100%", alignItems: "center" },
    summaryTitle: { fontSize: 24, fontWeight: "800", color: "#000", marginTop: 16, marginBottom: 24 },
    summaryStats: { flexDirection: "row", width: "100%", gap: 16, marginBottom: 32 },
    summaryStat: { flex: 1, backgroundColor: "#f8fafc", padding: 16, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
    summaryLabel: { fontSize: 10, color: "#64748b", marginBottom: 4, textTransform: "uppercase" },
    summaryValue: { fontSize: 16, fontWeight: "700", color: "#000" },
    summaryBtn: { backgroundColor: AppColors.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: "100%", alignItems: "center" },
    summaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
