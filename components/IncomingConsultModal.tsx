import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "@/constants/theme";

type IncomingConsultModalProps = {
    visible: boolean;
    request: {
        sessionId: string;
        userName: string;
        type: string;
        ratePerMinute: number;
    } | null;
    onAccept: () => void;
    onDecline: () => void;
};

export const IncomingConsultModal = ({
    visible,
    request,
    onAccept,
    onDecline,
}: IncomingConsultModalProps) => {
    const [timeLeft, setTimeLeft] = React.useState(60);

    React.useEffect(() => {
        if (!visible || !request) {
            setTimeLeft(60);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onDecline();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [visible, request]);

    if (!request) return null;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="call" size={30} color={AppColors.primary} />
                        </View>
                        <Text style={styles.title}>Incoming Consultation</Text>
                        <View style={styles.timerBadge}>
                            <Ionicons name="time" size={14} color={AppColors.primary} />
                            <Text style={styles.timerText}>{timeLeft}s</Text>
                        </View>
                    </View>

                    <View style={styles.content}>
                        <Image
                            source={require("@/assets/court/lawyer1.jpeg")} // Placeholder
                            style={styles.avatar}
                        />
                        <Text style={styles.userName}>{request.userName}</Text>
                        <Text style={styles.details}>
                            {request.type} • ₹{request.ratePerMinute}/min
                        </Text>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btn, styles.declineBtn]}
                            onPress={onDecline}
                        >
                            <Text style={styles.declineText}>Decline</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn, styles.acceptBtn]}
                            onPress={onAccept}
                        >
                            <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 20,
    },
    container: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#ebf2ff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: AppColors.text,
    },
    content: {
        alignItems: "center",
        marginBottom: 30,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    userName: {
        fontSize: 22,
        fontWeight: "700",
        color: AppColors.text,
    },
    details: {
        fontSize: 16,
        color: AppColors.textSecondary,
        marginTop: 4,
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    btn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
    },
    declineBtn: {
        backgroundColor: "#FFE4E6",
    },
    acceptBtn: {
        backgroundColor: AppColors.primary,
    },
    declineText: {
        color: "#E11D48",
        fontWeight: "700",
    },
    acceptText: {
        color: "#fff",
        fontWeight: "700",
    },
    timerBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ebf2ff",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
        gap: 4,
    },
    timerText: {
        fontSize: 14,
        fontWeight: "700",
        color: AppColors.primary,
    },
});
